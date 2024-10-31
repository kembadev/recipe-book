import z from 'zod';
import { measurementUnits } from '../consts.js';

const stringSchemaBase = z.string().min(1);

const ingredientSquema = z.object({
	name: stringSchemaBase.max(40),
	quantity: z.number().int().min(1),
	measurement_unit: z.enum(measurementUnits),
});

const recipeSquema = z.object({
	title: stringSchemaBase.max(80),
	description: stringSchemaBase.nullable(),
	ingredients: z.array(ingredientSquema).nonempty(),
	steps: stringSchemaBase.array().nonempty(),
	prep_time: stringSchemaBase,
	cook_time: stringSchemaBase,
	yield: z.number().int().min(1),
	visibility: z.enum(['public', 'private']),
});

export type RecipeSquema = z.infer<typeof recipeSquema>;

function validateRecipe(input: unknown) {
	return recipeSquema.safeParse(input);
}

function validatePartialRecipe(input: unknown) {
	return recipeSquema.safeParse(input);
}

export { validateRecipe, validatePartialRecipe };
