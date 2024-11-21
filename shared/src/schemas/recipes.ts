import z from 'zod';
import { measurementUnits } from '../consts.js';

const stringSchemaBase = z.string().min(1);

const ingredientSchema = z.object({
	name: stringSchemaBase.max(40),
	quantity: z.number().int().min(1),
	measurement_unit: z.enum(measurementUnits),
});

export const recipeSchema = z.object({
	title: stringSchemaBase.max(80),
	description: stringSchemaBase.nullable(),
	ingredients: z.array(ingredientSchema).nonempty(),
	steps: stringSchemaBase.array().nonempty(),
	prep_time: stringSchemaBase,
	cook_time: stringSchemaBase,
	recipeYield: z.number().int().min(1),
	visibility: z.enum(['public', 'private']),
});
