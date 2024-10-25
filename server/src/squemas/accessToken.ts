import z from 'zod';
import { userSquemaBase } from './users.js';

const utcDateSchema = z
	.string()
	.regex(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
		'Invalid date in UTC format.',
	);

const accessTokenSquemaBase = z.object({
	createdAt: utcDateSchema,
});

const accessTokenSquema = userSquemaBase.merge(accessTokenSquemaBase);

export function validateAccessToken(tokenData: unknown) {
	return accessTokenSquema.safeParse(tokenData);
}
