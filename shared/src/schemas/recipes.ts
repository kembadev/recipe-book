import { ingredientsMeasurementUnits, visibility } from '../consts.js';

import { object, string, number, array } from 'yup';

const stringSchemaRequired = string().required();
const stringSchemaNoEmpty = stringSchemaRequired.min(1);

const numberSchemaRequired = number().required();

const arraySchemaRequired = array().required();
const arraySchemaNoEmpty = arraySchemaRequired.min(1);

const ingredientSchema = object({
	name: stringSchemaNoEmpty.max(40),
	quantity: numberSchemaRequired.min(1).max(1e4).integer(),
	measurementUnit: stringSchemaRequired.oneOf(ingredientsMeasurementUnits),
});

const secondsTimeSchema = numberSchemaRequired.min(1).integer();

const recipeTimeSpentSchema = object({
	prepTime: secondsTimeSchema.max(60 * 60 * 4),
	cookTime: secondsTimeSchema.max(60 * 60 * 16).nullable(),
});

export const recipeSchema = object({
	title: stringSchemaNoEmpty.max(80),
	description: stringSchemaRequired.max(600),
	ingredients: arraySchemaNoEmpty.of(ingredientSchema),
	steps: arraySchemaRequired.of(stringSchemaNoEmpty.max(400)).max(30),
	timeSpent: recipeTimeSpentSchema,
	recipeYield: numberSchemaRequired.min(1).max(1000).integer(),
	visibility: stringSchemaRequired.oneOf(visibility),
});
