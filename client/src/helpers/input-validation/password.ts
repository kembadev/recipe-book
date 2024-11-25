import { Result } from '@monorepo/shared';

export class PasswordValidation {
	static #validatePasswordBase(password: unknown) {
		if (typeof password !== 'string') {
			return Result.failed(new Error('The password must be a string.'));
		}

		if (password.length < 7 || password.length > 22) {
			return Result.failed(
				new Error(
					'The password must be equal to or greater than 7 and equal to or less than 22.',
				),
			);
		}

		return Result.success(password);
	}

	static registration(password: unknown) {
		const baseValidation = this.#validatePasswordBase(password);

		const { success, value: validatedPassword } = baseValidation;

		if (!success) return baseValidation;

		if (!/^[a-zA-Z0-9]+$/.test(validatedPassword)) {
			return Result.failed(
				new Error('The password must only contain letters and numbers.'),
			);
		}

		if (!/[a-z]/.test(validatedPassword)) {
			return Result.failed(
				new Error('The password must contain at least one lowercase letter.'),
			);
		}

		if (!/[A-Z]/.test(validatedPassword)) {
			return Result.failed(
				new Error('The password must contain at least one uppercase letter.'),
			);
		}

		if (!/[0-9]/.test(validatedPassword)) {
			return Result.failed(
				new Error('The password must contain at least one number.'),
			);
		}

		return Result.success(validatedPassword);
	}

	static login(password: unknown) {
		return this.#validatePasswordBase(password);
	}
}
