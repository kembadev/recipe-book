import type { RequestHandler } from 'express';
import { SECRET_JWT_KEY } from '../config.js';
import { validateAccessToken } from '../schemas/accessToken.js';
import jwt from 'jsonwebtoken';

const options: jwt.VerifyOptions = {
	maxAge: '1h',
};

export const sessionMiddleware: RequestHandler = (req, _res, next) => {
	req.session = { user: null };

	if (typeof SECRET_JWT_KEY !== 'string') {
		console.error('SECRET_JWT_KEY may not be defined. Set it in the .env file');
		return next();
	}

	const token = req.cookies.access_token;

	if (typeof token !== 'string') return next();

	jwt.verify(token, SECRET_JWT_KEY, options, (err, payload) => {
		if (err) return next();

		const { success, data } = validateAccessToken(payload);

		if (success) {
			req.session = { user: data };
		}

		next();
	});
};
