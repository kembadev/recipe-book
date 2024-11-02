import type { ErrorRequestHandler } from 'express';
import fs from 'node:fs';

import multer from 'multer';
import path from 'node:path';
import { ERROR_CODES, ResponseSchema } from '../helpers/ResponseSchema.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		const pathUrl = path.join(__dirname, '../db/uploads/recipes-images');

		if (!fs.existsSync(pathUrl)) {
			fs.mkdirSync(pathUrl, { recursive: true });
		}

		cb(null, pathUrl);
	},
	filename: (_req, file, cb) => {
		const extension = file.originalname.split('.').at(-1);

		const ModifiedUTC = new Date().toISOString().replace(/:/g, '-'); // because Windows
		const randomInt = Math.round(Math.random() * 1e6);

		const filename = ModifiedUTC + '__' + randomInt + '.' + extension;

		cb(null, filename);
	},
});

export const processRecipeMiddleware = multer({
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

export const processRecipeErrorMiddleware: ErrorRequestHandler = (
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
