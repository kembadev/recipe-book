import { supportedImageFormats } from '../consts.js';

import {
	InvalidFormatUploadError,
	UploadError,
} from '../error-handling/upload.js';

import sharp from 'sharp';

/**
 * Checks file metadata, compares format with supportedImageFormats
 * allow list and validates the image dimensions (if found)
 *
 * @returns UploadError instance if the file does not meet the validations
 */
export async function validateImageFile(file: Express.Multer.File) {
	let metadata;

	try {
		metadata = await sharp(file.buffer).metadata();
	} catch {
		return new UploadError('Invalid file.');
	}

	const { format, width, height } = metadata;

	if (!format || !supportedImageFormats.includes(format)) {
		return new InvalidFormatUploadError('Invalid format.');
	}

	if ([width, height].some(d => !d || d < 0)) {
		return new UploadError('Invalid image dimensions.');
	}
}
