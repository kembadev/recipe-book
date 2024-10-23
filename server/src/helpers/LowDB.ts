import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { Result } from '../utils/Result.js';

class LocalDBError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'LocalDBError';
	}
}

type DB<T> = Record<string, T>;

interface LocalDBConfig<T> {
	pathUrl: string;
	relativePath: string;
	initialData?: DB<T>;
}

type Matcher<Q> = string | ((key: string, value: Q) => boolean);
type Item<Q> = [key: string, value: Q];

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

	async #read(): Promise<Result<null, null> | Result<null, LocalDBError>> {
		if (!this.#doesPathExist()) {
			return Result.failed(new LocalDBError('Local db file not found.'));
		}

		try {
			await this.#db.read();
			return Result.success(null);
		} catch {
			return Result.failed(
				new LocalDBError('Could not read the local db file.'),
			);
		}
	}

	async #updateDB(fn: (db: DB<Q>) => DB<Q>) {
		const { success, error } = await this.#read();

		if (!success) return error;

		this.#db.data = fn(this.#db.data);
		await this.#db.write();
		return null;
	}

	async findOne(
		matcher: Matcher<Q>,
	): Promise<[key: string, value: Q] | Error | undefined> {
		const { success, error } = await this.#read();

		if (!success) return error;

		const { data } = this.#db;

		if (typeof matcher === 'string') {
			const value = data[matcher];
			return value === undefined ? undefined : [matcher, value];
		}

		const keys = Object.keys(data);
		for (const key of keys) {
			const value = data[key];
			if (matcher(key, value)) return [key, value];
		}

		return undefined;
	}

	async addOne({ key, value }: { key: string; value: Q }) {
		const item = await this.findOne(key);

		if (Array.isArray(item)) return 'Key already in use.' as const;

		return await this.#updateDB(db => ({ ...db, [key]: value }));
	}

	async removeOne(matcher: Matcher<Q>) {
		const item = await this.findOne(matcher);

		if (!Array.isArray(item)) return item;

		const [key] = item;

		return new Promise<Q>(resolve => {
			this.#updateDB(db => {
				const { [key]: itemRemoved, ...rest } = db;
				resolve(itemRemoved);
				return rest;
			});
		});
	}

	async updateOne(matcher: Matcher<Q>, fn: (item: Item<Q>) => Item<Q>) {
		const item = await this.findOne(matcher);

		if (!Array.isArray(item)) return item;

		const [key] = item;

		return new Promise<Item<Q>>(resolve => {
			this.#updateDB(db => {
				const { [key]: value, ...rest } = db;

				const updatedItem = fn([key, value]);
				resolve(updatedItem);
				const [updatedKey, updatedValue] = updatedItem;

				return { ...rest, [updatedKey]: updatedValue };
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
	 * @param {string} localDBConfig.pathUrl - import.meta.url
	 */
	static async createDB<T>({
		pathUrl,
		relativePath,
		initialData = {},
	}: LocalDBConfig<T>) {
		const __filename = fileURLToPath(pathUrl);
		const __dirname = path.dirname(__filename);
		const dbPath = path.join(
			__dirname,
			relativePath.endsWith('.json') ? relativePath : `${relativePath}.json`,
		);

		const adapter = new JSONFile<DB<T>>(dbPath);
		const db = new Low(adapter, initialData);
		await db.write();

		return new LocalDB<T>(dbPath, db);
	}
}
