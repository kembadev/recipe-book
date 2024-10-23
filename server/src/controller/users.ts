import type { Handler } from '../types/express.js';
import { UsersModule } from '../model/users-local.js';
import { ResponseSquema, ERROR_CODES } from '../helpers/ResponseSquema.js';
import { validateUser } from '../squemas/users.js';

export class UsersController {
	static create: Handler = async (req, res) => {
		const {
			success: isValidUser,
			error: validationError,
			data,
		} = validateUser(req.body);

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
		const { success: isValidUser, error, data } = validateUser(req.body);

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

		if (result.success) {
			res.json(
				ResponseSquema.success({
					data: result.value,
				}),
			);

			return;
		}

		const { paramsError } = result;
		const statusCode = paramsError?.password ? 401 : 400;

		res.status(statusCode).json(
			ResponseSquema.failed({
				message: 'Could not complete the login.',
				errorCode: ERROR_CODES.OTHERS,
				details: paramsError,
			}),
		);
	};
}
