import type { Handler } from '../types/express.js';
import type { PublicUser } from 'types/users.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateAccessToken } from '../schemas/accessToken.js';
import jwt from 'jsonwebtoken';

export const sessionMiddleware: Handler = (req, _res, next) => {
	const token = req.cookies.access_token;

	try {
		if (typeof SECRET_JWT_KEY !== 'string') {
			throw new Error(
				'SECRET_JWT_KEY may not be defined. Set it in the .env file',
			);
		}

		const tokenData = jwt.verify(token, SECRET_JWT_KEY);
		const { success, data } = validateAccessToken(tokenData);

		if (!success) throw Error('Invalid token data.');

		req.session = { user: data as PublicUser };
	} catch (err) {
		if (typeof SECRET_JWT_KEY !== 'string') console.error(err);

		req.session = { user: null };
	}

	next();
};
