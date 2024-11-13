import { Result } from '@monorepo/shared';

type ValidationResult = Result<null, null> | Result<null, Error>;

export class UsernameValidation {
	static registration(username: unknown): ValidationResult {
		if (typeof username !== 'string') {
			return Result.failed(new Error('The username must be a string.'));
		}

		const usernameLength = username.length;
		if (usernameLength < 1 || usernameLength > 14) {
			return Result.failed(
				new Error(
					'The username length must be equal to or greater than 7 and equal to or less than 14.',
				),
			);
		}

		if (!/^[a-zA-Z0-9]+$/.test(username)) {
			return Result.failed(
				new Error('The username must only contain letters and/or numbers.'),
			);
		}

		return Result.success(null);
	}

	static login(username: unknown) {
		return this.registration(username);
	}
}
