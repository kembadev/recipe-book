import { RequestHandler } from 'express';
import { ERROR_CODES, ResponseSchema } from '../helpers/ResponseSchema.js';

export const authorizationMiddleware: RequestHandler = (req, res, next) => {
	const user = req.session;

	if (!(user instanceof Error) && user !== null) return next();

	const message = user === null ? 'No token provided.' : 'Invalid token.';

	res.status(401).json(
		ResponseSchema.failed({
			message,
			errorCode: ERROR_CODES.UNAUTHORIZED,
		}),
	);
};
