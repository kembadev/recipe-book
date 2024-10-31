import type { ErrorRequestHandler } from 'express';

import multer from 'multer';
import path from 'node:path';
import { ERROR_CODES, ResponseSchema } from 'helpers/ResponseSchema.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, path.join(__dirname, '../db/uploads/recipes-images'));
	},
	filename: (_req, file, cb) => {
		const UTC = new Date().toISOString();
		const randomInt = Math.round(Math.random() * 1e6);

		const uniqueSuffix = UTC + '__' + randomInt;

		const modifiedFilename = file.originalname
			.slice(0, 50)
			.replace(/\s+/g, '-');

		cb(null, uniqueSuffix + '__' + modifiedFilename);
	},
});

export const processRecipe = multer({
	storage,
	fileFilter: (_req, file, cb) => {
		if (/^image/.test(file.mimetype)) {
			return cb(null, true);
		}

		cb(
			new Error(
				`The file provided must be of image type. Received ${file.mimetype}`,
			),
		);
	},
}).single('image');

export const processRecipeErrorHandling: ErrorRequestHandler = (
	err,
	_req,
	res,
	next,
) => {
	if (!(err instanceof Error)) return next(err);

	if (err instanceof multer.MulterError) {
		res.status(500).json(
			ResponseSchema.failed({
				message: 'Something went wrong.',
				errorCode: ERROR_CODES.INTERNAL_ERROR,
			}),
		);

		return;
	}

	res.status(400).json(
		ResponseSchema.failed({
			message: err.message,
			errorCode: ERROR_CODES.OTHERS,
		}),
	);
};
