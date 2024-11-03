import { RequestHandler } from 'express';
import { ERROR_CODES, ResponseSchema } from '../helpers/ResponseSchema.js';

export const authorizationMiddleware: RequestHandler = (req, res, next) => {
	const user = req.session.user;

	if (user) return next();

	res.status(401).json(
		ResponseSchema.failed({
			message: 'Access was denied.',
			errorCode: ERROR_CODES.UNAUTHORIZED,
		}),
	);
};
