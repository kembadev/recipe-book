import z from 'zod';

export const userSquemaBase = z.object({
	name: z
		.string()
		.min(1)
		.max(14)
		.regex(
			/^[a-zA-Z0-9]+$/,
			'The name must only contain letters and/or numbers.',
		),
});

const passwordSquemaBase = z.string().min(7);

const userRegisterSquema = userSquemaBase.merge(
	z.object({
		password: passwordSquemaBase
			.regex(
				/[A-Z]/,
				'The password must contain at least one uppercase letter.',
			)
			.regex(
				/[a-z]/,
				'The password must contain at least one lowercase letter.',
			)
			.regex(/[0-9]/, 'The password must contain at least one number.'),
	}),
);

const userLoginSquema = userSquemaBase.merge(
	z.object({
		password: passwordSquemaBase,
	}),
);

/**
 * @returns - User validation with strict password validation
 */
function validateUserRegister(input: unknown) {
	return userRegisterSquema.safeParse(input);
}

/**
 * @returns - Partial user validation with strict password validation
 */
function validatePartialUser(input: unknown) {
	return userRegisterSquema.partial().safeParse(input);
}

/**
 * @returns - User validation with minimum required password validation
 */
function validateUserLogin(input: unknown) {
	return userLoginSquema.safeParse(input);
}

export { validateUserRegister, validatePartialUser, validateUserLogin };
