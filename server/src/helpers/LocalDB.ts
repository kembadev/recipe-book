import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

import { LocalDBError } from '../error-handling/local-db.js';
import { Result } from '@monorepo/shared';

type DB<T> = Record<string, T>;

interface LocalDBConfig<T> {
	pathUrl: string;
	initialData?: DB<T>;
}

type Matcher<Q> = string | ((_id: string, value: Q) => boolean);
type Item<Q> = [_id: string, value: Q];

export class LocalDB<Q> {
	#path: string;
	#db: Low<DB<Q>>;

	constructor(path: string, db: Low<DB<Q>>) {
		this.#path = path;
		this.#db = db;
	}

	#doesPathExist() {
		return existsSync(this.#path);
	}

	async #read() {
		if (!this.#doesPathExist()) {
			return Result.failed(new LocalDBError('Local db file not found.'));
		}

		try {
			await this.#db.read(); // -> this.#db.data will potentially cause memory to be out of bounds
			return Result.success(null);
		} catch {
			return Result.failed(
				new LocalDBError('Could not read the local db file.'),
			);
		}
	}

	async #updateDB(fn: (db: DB<Q>) => DB<Q> | Promise<DB<Q>>) {
		const { success, error } = await this.#read();

		if (!success) return error;

		this.#db.data = await fn(this.#db.data);
		await this.#db.write(); // -> will potentially become too slow

		return null;
	}

	async findOne(
		matcher: Matcher<Q>,
	): Promise<[_id: string, value: Q] | LocalDBError | undefined> {
		const { success, error } = await this.#read();

		if (!success) return error;

		const { data } = this.#db;

		if (typeof matcher === 'string') {
			const value = data[matcher];
			return value === undefined ? undefined : [matcher, value];
		}

		for (const _id in data) {
			if (!Object.hasOwn(data, _id)) continue;

			const value = data[_id];

			if (matcher(_id, value)) return [_id, value];
		}

		return undefined;
	}

	async addOne(value: Q) {
		let _id = randomUUID();
		let item = await this.findOne(_id);

		while (Array.isArray(item)) {
			_id = randomUUID();
			item = await this.findOne(_id);
		}

		const result =
			item ?? (await this.#updateDB(db => ({ ...db, [_id]: value }))) ?? _id;

		return result;
	}

	async removeOne(matcher: Matcher<Q>) {
		const item = await this.findOne(matcher);

		if (!Array.isArray(item)) return item;

		const [_id] = item;

		return new Promise<Q>(resolve => {
			this.#updateDB(db => {
				const { [_id]: itemRemoved, ...rest } = db;
				resolve(itemRemoved);
				return rest;
			});
		});
	}

	async updateOne(matcher: Matcher<Q>, fn: (value: Q) => Q | Promise<Q>) {
		const item = await this.findOne(matcher);

		if (!Array.isArray(item)) return item;

		const _id = item[0];

		return new Promise<Item<Q>>(resolve => {
			this.#updateDB(async db => {
				const { [_id]: value, ...rest } = db;

				const updatedValue = await fn(value);

				resolve([_id, updatedValue]);

				return { ...rest, [_id]: updatedValue };
			});
		});
	}

	async getAll() {
		const { success, error } = await this.#read();

		if (!success) return error;

		return this.#db.data;
	}

	async clearAll() {
		return await this.#updateDB(() => ({}));
	}

	/**
	 * @param {LocalDBConfig} localDBConfig
	 * @param {string} localDBConfig.pathUrl - Absolute path to the db file
	 */
	static async createDB<T>({ pathUrl, initialData = {} }: LocalDBConfig<T>) {
		const dbLocation = pathUrl.endsWith('.json') ? pathUrl : `${pathUrl}.json`;

		const adapter = new JSONFile<DB<T>>(dbLocation);
		const db = new Low(adapter, initialData);
		await db.write();

		return new LocalDB<T>(dbLocation, db);
	}
}
