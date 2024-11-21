import type { RequestHandler } from 'express';

import { SECRET_JWT_KEY } from '../config.js';

import { validateAccessToken } from '../schemas/accessToken.js';
import jwt from 'jsonwebtoken';
import {
	BadPayloadTokenError,
	TokenValidationError,
} from '../error-handling/token.js';

const options: jwt.VerifyOptions = {
	maxAge: '1h',
};

export const sessionMiddleware: RequestHandler = (req, _res, next) => {
	req.session = null;

	if (typeof SECRET_JWT_KEY !== 'string') {
		console.error('SECRET_JWT_KEY may not be defined. Set it in the .env file');

		return next();
	}

	const token = req.cookies.access_token;

	if (typeof token !== 'string') return next();

	jwt.verify(token, SECRET_JWT_KEY, options, (err, payload) => {
		if (err) {
			req.session = new TokenValidationError('Invalid access token.');

			return next();
		}

		const { success, data } = validateAccessToken(payload);

		if (success) {
			req.session = data;

			return next();
		}

		req.session = new BadPayloadTokenError(
			'Invalid access token extra/custom payload. Malformed or incorrectly formatted data was found.',
		);

		next();
	});
};
