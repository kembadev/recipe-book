import type { RequestHandler } from 'express';
import type { TokenPayloadUser } from '../types/users.js';

import { ResponseSchema, ERROR_CODES } from '../helpers/ResponseSchema.js';
import { AuthModel } from '../model/auth-local.js';

export class AuthController {
	static getUserInfo: RequestHandler = async (req, res) => {
		const user = req.session as TokenPayloadUser;
		const userInfo = await AuthModel.getUserInfo(user.id);

		if (!userInfo) {
			res.status(400).json(
				ResponseSchema.failed({
					message: 'User not found.',
					errorCode: ERROR_CODES.BAD_REQUEST,
				}),
			);

			return;
		}

		if (userInfo instanceof Error) {
			res.status(500).json(
				ResponseSchema.failed({
					message: 'Something went wrong.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		res.json(ResponseSchema.success({ data: userInfo }));
	};
}
