import type { Handler } from '../types/express.js';
import type { PublicUser } from 'types/users.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateAccessToken } from '../squemas/accessToken.js';
import jwt from 'jsonwebtoken';

export const sessionMiddleware: Handler = (req, _res, next) => {
	const token = req.cookies.access_token;

	try {
		const tokenData = jwt.verify(token, SECRET_JWT_KEY);

		const { success, data } = validateAccessToken(tokenData);

		if (!success) throw Error('Invalid token data.');

		req.session = { user: data as PublicUser };
	} catch {
		req.session = { user: null };
	}

	next();
};
