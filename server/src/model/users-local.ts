import type { User } from '@monorepo/shared';
import type {
	CreateUser,
	LoginUser,
	GetAuthData,
	UploadAvatar,
} from '../types/users.js';

import { SALT_ROUNDS } from '../config.js';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

import { ExtractFromUser } from '../helpers/ExtractFromUser.js';
import UsersDB from '../db/local/users.mjs';
import bcrypt from 'bcrypt';

import {
	PasswordValidationError,
	UsernameNotAvailableError,
} from '../error-handling/auth.js';
import { generateUniqueFilename } from '../helpers/generateUniqueFilename.js';
import { Result } from '@monorepo/shared';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarImagePathUrl = path.join(__dirname, '../db/uploads/avatars-images');

if (!fs.existsSync(avatarImagePathUrl)) {
	fs.mkdirSync(avatarImagePathUrl, { recursive: true });
}

export class UsersModule {
	static create: CreateUser = async ({ name, password }) => {
		const userInDB = await UsersDB.findOne(
			(_id, { name: nameInUse }) =>
				nameInUse.toLowerCase() === name.toLowerCase(),
		);

		if (userInDB instanceof Error) return Result.failed(userInDB);

		if (userInDB) {
			return Result.failed(
				new UsernameNotAvailableError('The user already exists.'),
			);
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

		const userId = await UsersDB.addOne(newUser);

		return typeof userId === 'string'
			? Result.success(null)
			: Result.failed(userId);
	};

	static login: LoginUser = async ({ name, password }) => {
		const user = await UsersDB.findOne(
			(_id, { name: nameInUse }) => nameInUse === name,
		);

		if (!user) return;

		if (user instanceof Error) return Result.failed(user);

		const [userId, userData] = user;
		const { password: hashedPassword } = userData;

		const isValidPassword = await bcrypt.compare(password, hashedPassword);

		if (isValidPassword) return Result.success({ userId });

		return Result.failed(new PasswordValidationError('Invalid password.'));
	};

	static getAuthData: GetAuthData = async userId => {
		const user = await UsersDB.findOne(userId);

		if (!Array.isArray(user)) return user;

		const userData = user[1];

		const { name, createdAt } = ExtractFromUser.basePrivateData(userData);
		const { avatar_filename } = userData;

		return { name, createdAt, avatar_filename };
	};

	static uploadAvatar: UploadAvatar = async ({ userId, file }) => {
		const avatar_filename = generateUniqueFilename() + '.jpg';

		let manipulatedBuffer;

		try {
			manipulatedBuffer = await sharp(file.buffer)
				.resize({ width: 300, height: 300, fit: 'inside' })
				.jpeg()
				.toBuffer();
		} catch {
			return Result.failed(new Error('Something went wrong.'));
		}

		return new Promise(resolve => {
			const filePath = path.join(avatarImagePathUrl, avatar_filename);

			fs.writeFile(filePath, manipulatedBuffer, async err => {
				if (err) return resolve(Result.failed(err));

				const user = await UsersDB.updateOne(userId, async userData => {
					const prevFilename = userData.avatar_filename;

					// if exists, delete the previous avatar
					if (prevFilename) {
						await new Promise(resolve => {
							const prevFilePath = path.join(avatarImagePathUrl, prevFilename);

							if (fs.existsSync(prevFilePath)) {
								return fs.unlink(prevFilePath, resolve);
							}

							return resolve(null);
						});
					}

					return { ...userData, avatar_filename };
				});

				if (Array.isArray(user)) {
					return resolve(Result.success({ avatar_filename }));
				}

				await new Promise(resolve => {
					fs.unlink(filePath, resolve);
				});

				if (!user) return resolve(user);

				resolve(Result.failed(user));
			});
		});
	};
}
