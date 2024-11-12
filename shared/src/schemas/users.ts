import z from 'zod';

export const userSchemaBase = z.object({
	name: z
		.string()
		.min(1)
		.max(14)
		.regex(
			/^[a-zA-Z0-9]+$/,
			'The name must only contain letters and/or numbers.',
		),
});

export const passwordSchemaBase = z.string().min(7).max(22);

export const userRegisterSchema = userSchemaBase.merge(
	z.object({
		password: passwordSchemaBase
			.regex(
				/[A-Z]/,
				'The password must contain at least one uppercase letter.',
			)
			.regex(
				/[a-z]/,
				'The password must contain at least one lowercase letter.',
			)
			.regex(/[0-9]/, 'The password must contain at least one number.')
			.regex(
				/^[a-zA-Z0-9]+$/,
				'The password must only contain letters and/or numbers.',
			),
	}),
);
