import type { RequestHandler } from 'express';
import type { TokenPayloadUser } from '../types/users.js';

import { IS_DEVELOPMENT, SECRET_JWT_KEY } from '../config.js';

import jwt from 'jsonwebtoken';
import { UsersModule } from '../model/users-local.js';

import { ResponseSchema, ERROR_CODES, type AuthData } from '@monorepo/shared';
import { validateUserRegister, validateUserLogin } from '../schemas/users.js';
import {
	PasswordValidationError,
	UsernameNotAvailableError,
} from '../error-handling/auth.js';

export class UsersController {
	static create: RequestHandler = async (req, res) => {
		const {
			success: isValidUser,
			error: bodyValidationError,
			data,
		} = validateUserRegister(req.body);

		if (!isValidUser) {
			res.status(422).json(
				ResponseSchema.failed({
					message: 'Invalid request body format.',
					errorCode: ERROR_CODES.INVALID_PARAMS,
					details: JSON.parse(bodyValidationError.message),
				}),
			);

			return;
		}

		const { success, error } = await UsersModule.create(data);

		if (success) {
			res.status(201).json(ResponseSchema.success({ data: null }));

			return;
		}

		if (error instanceof UsernameNotAvailableError) {
			res.status(409).json(
				ResponseSchema.failed({
					message: 'The user already exists.',
					errorCode: ERROR_CODES.OTHERS,
				}),
			);

			return;
		}

		res.status(500).json(
			ResponseSchema.failed({
				message: 'Could not create the user.',
				errorCode: ERROR_CODES.INTERNAL_ERROR,
			}),
		);
	};

	static login: RequestHandler = async (req, res) => {
		const {
			success: isValidUser,
			error: bodyValidationError,
			data,
		} = validateUserLogin(req.body);

		if (!isValidUser) {
			res.status(422).json(
				ResponseSchema.failed({
					message: 'Invalid request body format.',
					errorCode: ERROR_CODES.INVALID_PARAMS,
					details: JSON.parse(bodyValidationError.message),
				}),
			);

			return;
		}

		const result = await UsersModule.login(data);

		if (!result) {
			res.status(404).json(
				ResponseSchema.failed({
					message: 'User not found.',
					errorCode: ERROR_CODES.NOT_FOUND,
				}),
			);

			return;
		}

		const { success, error, value } = result;

		if (success && typeof SECRET_JWT_KEY === 'string') {
			const { userId } = value;

			const token = jwt.sign({ id: userId }, SECRET_JWT_KEY, {
				expiresIn: '1h',
			});

			res
				.cookie('access_token', token, {
					httpOnly: true,
					secure: !IS_DEVELOPMENT,
					sameSite: 'strict',
					maxAge: 1000 * 60 * 60,
				})
				.json(ResponseSchema.success({ data: null }));

			return;
		}

		if (success) {
			console.error(
				'SECRET_JWT_KEY may not be defined. Set it in the .env file.',
			);

			res.status(500).json(
				ResponseSchema.failed({
					message: 'Something went wrong.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		if (error instanceof PasswordValidationError) {
			res.status(401).json(
				ResponseSchema.failed({
					message: 'Invalid password.',
					errorCode: ERROR_CODES.UNAUTHORIZED,
				}),
			);

			return;
		}

		res.status(500).json(
			ResponseSchema.failed({
				message: 'Could not complete the login.',
				errorCode: ERROR_CODES.INTERNAL_ERROR,
			}),
		);
	};

	static logout: RequestHandler = (_req, res) => {
		res.clearCookie('access_token').json(
			ResponseSchema.success({
				message: 'Logout successful.',
				data: null,
			}),
		);
	};

	static getAuthData: RequestHandler = async (req, res) => {
		const user = req.session as TokenPayloadUser;
		const authData = await UsersModule.getAuthData(user.id);

		if (!authData) {
			res.status(404).json(
				ResponseSchema.failed({
					message: 'User not found.',
					errorCode: ERROR_CODES.NOT_FOUND,
				}),
			);

			return;
		}

		if (authData instanceof Error) {
			res.status(500).json(
				ResponseSchema.failed({
					message: 'Something went wrong.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		const { name, createdAt, avatar_filename } = authData;
		const avatar_src = avatar_filename
			? `/images/avatars/${avatar_filename}`
			: null;

		const data: AuthData = {
			name,
			createdAt,
			avatar_src,
		};

		res.json(ResponseSchema.success({ data }));
	};

	static uploadAvatar: RequestHandler = async (req, res) => {
		const { id: userId } = req.session as TokenPayloadUser;

		// verified by validateSingleImageFile middleware
		const file = req.file!;

		const result = await UsersModule.uploadAvatar({ userId, file });

		if (!result) {
			res.status(404).json(
				ResponseSchema.failed({
					message: 'User not found.',
					errorCode: ERROR_CODES.NOT_FOUND,
				}),
			);

			return;
		}

		const { success, value } = result;

		if (success) {
			const { avatar_filename } = value;
			const avatar_src = `/images/avatars/${avatar_filename}`;

			res.status(201).json(ResponseSchema.success({ data: { avatar_src } }));

			return;
		}

		res.status(500).json(
			ResponseSchema.failed({
				message: 'Could not upload the image.',
				errorCode: ERROR_CODES.INTERNAL_ERROR,
			}),
		);
	};
}
