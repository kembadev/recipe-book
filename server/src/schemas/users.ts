import z from 'zod';
import {
	userSchemaBase,
	userRegisterSchema,
	passwordSchemaBase,
} from '@monorepo/shared';

const userLoginSchema = userSchemaBase.merge(
	z.object({
		password: passwordSchemaBase,
	}),
);

/**
 * @returns - User validation with strict password validation
 */
function validateUserRegister(input: unknown) {
	return userRegisterSchema.safeParse(input);
}

/**
 * @returns - Partial user validation with strict password validation
 */
function validatePartialUser(input: unknown) {
	return userRegisterSchema.partial().safeParse(input);
}

/**
 * @returns - User validation with minimum required password validation
 */
function validateUserLogin(input: unknown) {
	return userLoginSchema.safeParse(input);
}

export { validateUserRegister, validatePartialUser, validateUserLogin };
