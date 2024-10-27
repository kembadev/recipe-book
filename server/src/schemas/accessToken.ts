import z from 'zod';
import { userSchemaBase } from './users.js';

const utcDateSchema = z
	.string()
	.regex(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
		'Invalid date in UTC format.',
	);

const accessTokenSchemaBase = z.object({
	createdAt: utcDateSchema,
});

const accessTokenSchema = userSchemaBase.merge(accessTokenSchemaBase);

export function validateAccessToken(tokenData: unknown) {
	return accessTokenSchema.safeParse(tokenData);
}
