import type { ErrorRequestHandler } from 'express';

import { ERROR_CODES, ResponseSchema } from '@monorepo/shared';

export function bodyParsingErrorMiddleware(
	errorMessage: string,
): ErrorRequestHandler {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (_err, _req, res, _next) => {
		res.status(400).json(
			ResponseSchema.failed({
				message: errorMessage,
				errorCode: ERROR_CODES.BAD_REQUEST,
			}),
		);
	};
}
