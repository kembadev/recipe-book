import type { ErrorRequestHandler } from 'express';

import path from 'node:path';

import multer from 'multer';
import { ResponseSchema, ERROR_CODES } from '@monorepo/shared';

import {
	UploadError,
	InvalidMIMETypeUploadError,
} from '../error-handling/upload.js';

export const processImageUpload = multer({
	fileFilter: (_req, file, cb) => {
		const extension = path.extname(file.originalname);

		const isValidMIMEType = /^image\//.test(file.mimetype);
		const isValidExtension = ['.', ''].every(n => extension !== n);

		if (isValidMIMEType && isValidExtension) return cb(null, true);

		if (isValidMIMEType) {
			return cb(new UploadError('The image format could not be found.'));
		}

		cb(
			new InvalidMIMETypeUploadError(
				`The file provided must be an image. Received ${file.mimetype}`,
			),
		);
	},
});

export const processImageUploadErrorHandling: ErrorRequestHandler = (
	err,
	_req,
	res,
	next,
) => {
	if (err instanceof multer.MulterError) {
		res.status(500).json(
			ResponseSchema.failed({
				message: 'Something went wrong.',
				errorCode: ERROR_CODES.INTERNAL_ERROR,
			}),
		);

		return;
	}

	if (!(err instanceof UploadError)) return next(err);

	res.status(400 /* or non-standard 415 for InvalidMIMETypeUploadError */).json(
		ResponseSchema.failed({
			message: err.message,
			errorCode: ERROR_CODES.BAD_REQUEST,
		}),
	);
};
