import { Result } from '@monorepo/shared';

type ValidationResult = Result<null, null> | Result<null, Error>;

export class PasswordValidation {
	static registration(password: unknown): ValidationResult {
		if (typeof password !== 'string') {
			return Result.failed(new Error('The password must be a string.'));
		}

		const passwordLength = password.length;
		if (passwordLength < 7 || passwordLength > 22) {
			return Result.failed(
				new Error(
					'The password must be equal to or greater than 7 and equal to or less than 22.',
				),
			);
		}

		if (!/^[a-zA-Z0-9]+$/.test(password)) {
			return Result.failed(
				new Error('The password must only contain letters and numbers.'),
			);
		}

		if (!/[a-z]/.test(password)) {
			return Result.failed(
				new Error('The password must contain at least one lowercase letter.'),
			);
		}

		if (!/[A-Z]/.test(password)) {
			return Result.failed(
				new Error('The password must contain at least one uppercase letter.'),
			);
		}

		if (!/[0-9]/.test(password)) {
			return Result.failed(
				new Error('The password must contain at least one number.'),
			);
		}

		return Result.success(null);
	}

	static login(password: unknown): ValidationResult {
		if (typeof password !== 'string') {
			return Result.failed(new Error('The password must be a string.'));
		}

		const passwordLength = password.length;
		if (passwordLength < 7 || passwordLength > 22) {
			return Result.failed(
				new Error(
					'The password must be equal to or greater than 7 and equal to or less than 22.',
				),
			);
		}

		return Result.success(null);
	}
}
