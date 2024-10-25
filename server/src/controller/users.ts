import type { Handler } from '../types/express.js';
import { IS_DEVELOPMENT, SECRET_JWT_KEY } from '../config.js';

import { ResponseSquema, ERROR_CODES } from '../helpers/ResponseSquema.js';
import { validateUserRegister, validateUserLogin } from '../squemas/users.js';

import { UsersModule } from '../model/users-local.js';

import jwt from 'jsonwebtoken';

export class UsersController {
	static create: Handler = async (req, res) => {
		const {
			success: isValidUser,
			error: validationError,
			data,
		} = validateUserRegister(req.body);

		if (!isValidUser) {
			res.status(422).json(
				ResponseSquema.failed({
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
				ResponseSquema.failed({
					message: 'Could not create the user.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		if (result.success) {
			res.json(
				ResponseSquema.success({
					data: result.value,
				}),
			);

			return;
		}

		res.status(409).json(
			ResponseSquema.failed({
				message: 'Could not create the user.',
				errorCode: ERROR_CODES.OTHERS,
				details: result.paramsError,
			}),
		);
	};

	static login: Handler = async (req, res) => {
		const { success: isValidUser, error, data } = validateUserLogin(req.body);

		if (!isValidUser) {
			res.status(422).json(
				ResponseSquema.failed({
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
				ResponseSquema.failed({
					message: 'Could not complete the login.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		if (!result.success) {
			const { paramsError } = result;
			const statusCode = paramsError?.password ? 401 : 400;

			res.status(statusCode).json(
				ResponseSquema.failed({
					message: 'Could not complete the login.',
					errorCode: ERROR_CODES.OTHERS,
					details: paramsError,
				}),
			);

			return;
		}

		const user = result.value;
		let token: string;
		try {
			if (typeof SECRET_JWT_KEY !== 'string') {
				throw new Error(
					'SECRET_JWT_KEY may not be defined. Set it in the .env file',
				);
			}

			token = jwt.sign(user, SECRET_JWT_KEY, { expiresIn: '1h' });
		} catch (err) {
			console.error(err);

			res.json(
				ResponseSquema.failed({
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
				ResponseSquema.success({
					data: user,
				}),
			);
	};

	static logout: Handler = (_req, res) => {
		res.clearCookie('access_token').json(
			ResponseSquema.success({
				message: 'Logout successful.',
				data: null,
			}),
		);
	};
}
