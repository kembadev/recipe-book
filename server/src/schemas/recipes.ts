import { recipeSchema } from '@monorepo/shared';

function validateRecipe(input: unknown) {
	return recipeSchema.safeParse(input);
}

function validatePartialRecipe(input: unknown) {
	return recipeSchema.safeParse(input);
}

export { validateRecipe, validatePartialRecipe };
