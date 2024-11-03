import type { RequestHandler } from 'express';

import { IS_DEVELOPMENT, SECRET_JWT_KEY } from '../config.js';

import { ResponseSchema, ERROR_CODES } from '../helpers/ResponseSchema.js';
import { validateUserRegister, validateUserLogin } from '../schemas/users.js';

import { UsersModule } from '../model/users-local.js';

import jwt from 'jsonwebtoken';

export class UsersController {
	static create: RequestHandler = async (req, res) => {
		const {
			success: isValidUser,
			error: validationError,
			data,
		} = validateUserRegister(req.body);

		if (!isValidUser) {
			res.status(422).json(
				ResponseSchema.failed({
					message: 'Invalid request body format.',
					errorCode: ERROR_CODES.INVALID_PARAMS,
					details: JSON.parse(validationError.message),
				}),
			);

			return;
		}

		const result = await UsersModule.create(data);

		if (result instanceof Error) {
			res.status(500).json(
				ResponseSchema.failed({
					message: 'Could not create the user.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		if (result.success) {
			res.status(201).json(
				ResponseSchema.success({
					data: result.value,
				}),
			);

			return;
		}

		res.status(409).json(
			ResponseSchema.failed({
				message: 'Could not create the user.',
				errorCode: ERROR_CODES.OTHERS,
				details: result.paramsError,
			}),
		);
	};

	static login: RequestHandler = async (req, res) => {
		const { success: isValidUser, error, data } = validateUserLogin(req.body);

		if (!isValidUser) {
			res.status(422).json(
				ResponseSchema.failed({
					message: 'Invalid request body format.',
					errorCode: ERROR_CODES.INVALID_PARAMS,
					details: JSON.parse(error.message),
				}),
			);

			return;
		}

		const result = await UsersModule.login(data);

		if (result instanceof Error) {
			res.status(500).json(
				ResponseSchema.failed({
					message: 'Could not complete the login.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		if (!result.success) {
			const { paramsError } = result;

			const statusCode = paramsError.password ? 401 : 404;
			const errorCode = paramsError.password
				? ERROR_CODES.UNAUTHORIZED
				: ERROR_CODES.NOT_FOUND;

			res.status(statusCode).json(
				ResponseSchema.failed({
					message: 'Could not complete the login.',
					errorCode,
					details: paramsError,
				}),
			);

			return;
		}

		const { userData, userId } = result.value;
		let token: string;

		try {
			if (typeof SECRET_JWT_KEY !== 'string') {
				throw new Error(
					'SECRET_JWT_KEY may not be defined. Set it in the .env file',
				);
			}

			token = jwt.sign({ id: userId }, SECRET_JWT_KEY, { expiresIn: '1h' });
		} catch (err) {
			console.error(err);

			res.status(500).json(
				ResponseSchema.failed({
					message: 'Something went wrong.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		res
			.cookie('access_token', token, {
				httpOnly: true,
				secure: !IS_DEVELOPMENT,
				sameSite: 'strict',
				maxAge: 1000 * 60 * 60,
			})
			.json(
				ResponseSchema.success({
					data: userData,
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
}
