import z from 'zod';

const accessTokenSchema = z.object({
	id: z.string().uuid(),
});

export function validateAccessToken(tokenData: unknown) {
	return accessTokenSchema.safeParse(tokenData);
}
