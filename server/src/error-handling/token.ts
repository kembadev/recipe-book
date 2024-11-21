export class TokenError extends Error {
	name = 'TokenError';

	constructor(message: string) {
		super(message);
	}
}

export class TokenValidationError extends TokenError {
	name = 'TokenValidationError' as const;

	constructor(message: string) {
		super(message);
	}
}

export class BadPayloadTokenError extends TokenError {
	name = 'BadPayloadTokenError' as const;

	constructor(message: string) {
		super(message);
	}
}
