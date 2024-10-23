import type { User, ProvidedUserInfo, UserResult } from '../types/users.js';
import UsersDB from '../db/local/users.mjs';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { SALT_ROUNDS } from '../config.js';

export class UsersModule {
	static async create({
		name,
		password,
	}: ProvidedUserInfo): Promise<UserResult> {
		const isNameAvailable =
			(await UsersDB.findOne(
				(_key, { name: nameInUse }) => nameInUse === name,
			)) === undefined;

		if (!isNameAvailable) {
			return {
				success: false,
				paramsError: {
					name: 'The user already exists.',
				},
			};
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		const value: User = {
			name,
			password: hashedPassword,
			createdAt: new Date().toISOString(),
		};

		let key = randomUUID();
		let result = await UsersDB.addOne({ key, value });

		while (typeof result === 'string') {
			key = randomUUID();
			result = await UsersDB.addOne({ key, value });
		}

		const wasCreated = Array.isArray(await UsersDB.findOne(key));

		return wasCreated
			? { success: true, value }
			: new Error('Something went wrong.');
	}

	static async login({
		name,
		password,
	}: ProvidedUserInfo): Promise<UserResult> {
		const item = await UsersDB.findOne(
			(_key, { name: nameInUse }) => nameInUse === name,
		);

		if (item === undefined) {
			return {
				success: false,
				paramsError: {
					name: 'User not found.',
				},
			};
		}

		if (item instanceof Error) {
			return new Error('Something went wrong.');
		}

		const { password: hashedPassword, ...rest } = item[1];

		const isValidPassword = await bcrypt.compare(password, hashedPassword);

		if (isValidPassword) return { success: true, value: rest };

		return {
			success: false,
			paramsError: {
				password: 'Invalid password.',
			},
		};
	}
}
