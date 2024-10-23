import z from 'zod';

const userSquema = z.object({
	name: z.string().min(1),
	password: z.string().min(7),
});

function validateUser(input: unknown) {
	return userSquema.safeParse(input);
}

function validatePartialUser(input: unknown) {
	return userSquema.partial().safeParse(input);
}

export { validateUser, validatePartialUser };
