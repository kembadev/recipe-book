export class AuthValidationError extends Error {
	name = 'AuthValidationError';

	constructor(message: string) {
		super(message);
	}
}

export class PasswordValidationError extends AuthValidationError {
	name = 'PasswordValidationError' as const;

	constructor(message: string) {
		super(message);
	}
}

export class UsernameNotAvailableError extends AuthValidationError {
	name = 'UsernameNotAvailableError' as const;

	constructor(message: string) {
		super(message);
	}
}

export class UnauthorizedError extends AuthValidationError {
	name = 'UnauthorizedError' as const;

	constructor(message: string) {
		super(message);
	}
}
