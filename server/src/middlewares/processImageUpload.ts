import { supportedImageFormats } from '../consts.js';

import path from 'node:path';

import multer from 'multer';

import {
	InvalidMIMETypeUploadError,
	InvalidExtensionUploadError,
} from '../error-handling/upload.js';

interface SingleImageUploadProps {
	/** Max number of non-file fields (default: 20) */
	maxFields?: number;
	/** Max size of each non-file field value in bytes (default: 100kb) */
	maxFieldSize?: number;
	/** Fieldname of the desired file field */
	fieldName: string;
	/** Max size of the file in bytes (default: 5mb) */
	fileSizeLimit?: number;
}

export function processSingleImageUpload({
	fieldName,
	fileSizeLimit = 5e6,
	maxFieldSize = 1e5,
	maxFields = 20,
}: SingleImageUploadProps) {
	return multer({
		storage: multer.memoryStorage(),
		limits: {
			files: 1,
			fileSize: fileSizeLimit,
			fields: maxFields,
			fieldSize: maxFieldSize,
		},
		fileFilter: async (_req, file, cb) => {
			if (!/^image\//.test(file.mimetype)) {
				return cb(
					new InvalidMIMETypeUploadError(
						`The file provided must be an image. Received ${file.mimetype}.`,
					),
				);
			}

			const ext = path.extname(file.originalname).slice(1);

			if (!supportedImageFormats.includes(ext)) {
				return cb(new InvalidExtensionUploadError('Invalid extension.'));
			}

			cb(null, true);
		},
	}).single(fieldName);
}
