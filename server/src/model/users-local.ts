import type { User, PrivateUser } from '@monorepo/shared';
import type {
	CreateUser,
	LoginUser,
	GetInfo,
	UploadAvatar,
} from '../types/users.js';

import { SALT_ROUNDS } from '../config.js';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

import { ExtractFromUser } from '../helpers/ExtractFromUser.js';
import UsersDB from '../db/local/users.mjs';
import bcrypt from 'bcrypt';

import { generateUniqueFilename } from '../helpers/generateUniqueFilename.js';
import { Result } from '@monorepo/shared';
import { UploadError } from '../error-handling/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarImagePathUrl = path.join(__dirname, '../db/uploads/avatars-images');

if (!fs.existsSync(avatarImagePathUrl)) {
	fs.mkdirSync(avatarImagePathUrl, { recursive: true });
}

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
			avatar_filename: null,
		};

		const _id = await UsersDB.addOne(newUser);

		return typeof _id === 'string' ? { success: true } : _id;
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
		const { password: hashedPassword, avatar_filename } = userData;

		const isValidPassword = await bcrypt.compare(password, hashedPassword);

		if (!isValidPassword) {
			return {
				success: false,
				paramsError: {
					password: 'Invalid password.',
				},
			};
		}

		const basePrivateUserData = ExtractFromUser.basePrivateData(userData);
		const privateUserData: PrivateUser = {
			...basePrivateUserData,
			avatar_src: avatar_filename ? `/images/avatars/${avatar_filename}` : null,
		};

		return {
			success: true,
			value: {
				userId: _id,
				userData: privateUserData,
			},
		};
	};

	static getInfo: GetInfo = async userId => {
		const user = await UsersDB.findOne(userId);

		if (!Array.isArray(user)) return user;

		const basePrivateUserData = ExtractFromUser.basePrivateData(user[1]);

		const { avatar_filename } = user[1];

		return {
			...basePrivateUserData,
			avatar_src: avatar_filename ? `/images/avatars/${avatar_filename}` : null,
		};
	};

	static uploadAvatar: UploadAvatar = async ({ userId, file }) => {
		const avatar_filename = generateUniqueFilename(file.originalname);

		if (!avatar_filename) {
			return Result.failed(
				new UploadError('The image format could not be found.'),
			);
		}

		return new Promise(resolve => {
			const filePath = path.join(avatarImagePathUrl, avatar_filename);

			fs.writeFile(filePath, file.buffer, async err => {
				if (err) return resolve(Result.failed(err));

				const user = await UsersDB.updateOne(userId, userData => ({
					...userData,
					avatar_filename,
				}));

				if (Array.isArray(user)) {
					return resolve(Result.success({ filename: avatar_filename }));
				}

				await new Promise(resolve => {
					fs.rmdir(filePath, resolve);
				});

				if (!user) return resolve(user);

				resolve(Result.failed(user));
			});
		});
	};
}
