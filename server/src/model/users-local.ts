import type { User, CreateUser, LoginUser } from '../types/users.js';
import { SALT_ROUNDS } from '../config.js';

import UsersDB from '../db/local/users.mjs';

import bcrypt from 'bcrypt';

export class UsersModule {
	static create: CreateUser = async ({ name, password }) => {
		const userInDB = await UsersDB.findOne(
			(_id, { name: nameInUse }) => nameInUse === name,
		);

		if (userInDB instanceof Error) return userInDB;

		if (userInDB !== undefined) {
			return {
				success: false,
				paramsError: {
					name: 'The user already exists.',
				},
			};
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		const newUser: User = {
			name,
			password: hashedPassword,
			createdAt: new Date().toISOString(),
			savedRecipes: [],
			createdRecipes: [],
		};

		const _id = await UsersDB.addOne(newUser);

		return typeof _id !== 'string'
			? _id
			: {
					success: true,
					value: {
						name: newUser.name,
						createdAt: newUser.createdAt,
						createdRecipes: [],
						savedRecipes: [],
					},
				};
	};

	static login: LoginUser = async ({ name, password }) => {
		const user = await UsersDB.findOne(
			(_id, { name: nameInUse }) => nameInUse === name,
		);

		if (user instanceof Error) return user;

		if (user === undefined) {
			return {
				success: false,
				paramsError: {
					name: 'User not found.',
				},
			};
		}

		const [_id, userData] = user;
		const { password: hashedPassword, ...restOfTheUser } = userData;

		const isValidPassword = await bcrypt.compare(password, hashedPassword);

		if (!isValidPassword) {
			return {
				success: false,
				paramsError: {
					password: 'Invalid password.',
				},
			};
		}

		return {
			success: true,
			value: {
				userId: _id,
				userData: {
					name: restOfTheUser.name,
					createdAt: restOfTheUser.createdAt,
					createdRecipes: restOfTheUser.createdRecipes,
					savedRecipes: restOfTheUser.savedRecipes,
				},
			},
		};
	};
}
