import type { GetUserInfo } from '../types/auth.js';

import UsersDB from '../db/local/users.mjs';

export class AuthModel {
	static getUserInfo: GetUserInfo = async userId => {
		const result = await UsersDB.findOne(userId);

		if (!Array.isArray(result)) return result;

		const { name, createdAt, createdRecipes, savedRecipes } = result[1];

		return { name, createdAt, createdRecipes, savedRecipes };
	};
}
