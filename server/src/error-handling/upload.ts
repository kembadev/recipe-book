export class UploadError extends Error {
	name = 'UploadError';

	constructor(message: string) {
		super(message);
	}
}

export class InvalidMIMETypeUploadError extends UploadError {
	name = 'InvalidMIMETypeUploadError' as const;

	constructor(message: string) {
		super(message);
	}
}