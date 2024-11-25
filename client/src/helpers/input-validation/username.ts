import { Result } from '@monorepo/shared';

export class UsernameValidation {
	static #validateUsernameBase(username: unknown) {
		if (typeof username !== 'string') {
			return Result.failed(new Error('The username must be a string.'));
		}

		if (username.length < 1 || username.length > 14) {
			return Result.failed(
				new Error(
					'The username length must be equal to or greater than 7 and equal to or less than 14.',
				),
			);
		}

		return Result.success(username);
	}

	static registration(username: unknown) {
		const baseValidation = this.#validateUsernameBase(username);

		const { success, value: validatedUsername } = baseValidation;

		if (!success) return baseValidation;

		if (!/^[a-zA-Z0-9]+$/.test(validatedUsername)) {
			return Result.failed(
				new Error('The username must only contain letters and/or numbers.'),
			);
		}

		return Result.success(baseValidation);
	}

	static login(username: unknown) {
		return this.#validateUsernameBase(username);
	}
}
