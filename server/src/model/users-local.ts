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

		if (userInDB instanceof Error) return userInDB;

		if (userInDB) {
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
					return resolve(Result.success({ filename: avatar_filename }));
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
