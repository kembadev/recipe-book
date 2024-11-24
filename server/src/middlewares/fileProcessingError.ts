import type { ErrorRequestHandler } from 'express';

import { ResponseSchema, ERROR_CODES } from '@monorepo/shared';

import { MulterError } from 'multer';
import { UploadError } from '../error-handling/upload.js';

const processImageErrors = [MulterError, UploadError];

type ProcessImageError = (typeof processImageErrors)[number]['prototype'];

function isProcessImageError(err: unknown): err is ProcessImageError {
	return processImageErrors.some(e => err instanceof e);
}

/**
 * Checks whether the error is either a MulterError or an UploadError instance,
 * and if it does, a response with statusCode 400 and a corresponding message is sent.
 */
export const handleFileProcessingError: ErrorRequestHandler = (
	err,
	_req,
	res,
	next,
) => {
	if (!isProcessImageError(err)) return next(err);

	if (err instanceof UploadError) {
		res
			.status(400 /* or non-standard 415 for InvalidMIMETypeUploadError */)
			.json(
				ResponseSchema.failed({
					message: err.message,
					errorCode: ERROR_CODES.BAD_REQUEST,
				}),
			);

		return;
	}

	res.status(400);

	const badRequestSchema = ResponseSchema.failed({
		message: 'Bad request.',
		errorCode: ERROR_CODES.BAD_REQUEST,
	});

	if (err.code === 'LIMIT_FILE_SIZE') {
		badRequestSchema.message = 'The file exceed the limit size.';
	}

	if (err.cause === 'LIMIT_FILE_COUNT') {
		badRequestSchema.message =
			'Received more than one file field. Expected only *1* file field.';
	}

	if (err.code === 'LIMIT_FIELD_COUNT') {
		badRequestSchema.message = 'Exceed expected number of fields.';
	}

	res.json(badRequestSchema);
};
