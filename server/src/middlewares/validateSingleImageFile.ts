import type { RequestHandler } from 'express';

import { ERROR_CODES, ResponseSchema } from '@monorepo/shared';
import { validateImageFile } from '../helpers/validateImageFile.js';

/**
 * @returns Middleware that validates whether the file exists
 * and meets the minimum requirements for image files in the server.
 * If fails, next is called with the error
 */
export const validateSingleImageFile: (
	isFileRequired: boolean,
) => RequestHandler = isFileRequired => {
	return async (req, res, next) => {
		const file = req.file;

		if (!isFileRequired && !file) return next();

		if (file) {
			const validationError = await validateImageFile(file);

			return validationError ? next(validationError) : next();
		}

		// isFileRequired === true && file === undefined
		res.status(422).json(
			ResponseSchema.failed({
				message: 'No file provided.',
				errorCode: ERROR_CODES.INVALID_PARAMS,
			}),
		);
	};
};
