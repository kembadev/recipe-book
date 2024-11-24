import type { ValidationError } from 'yup';

import { recipeSchema, Result } from '@monorepo/shared';

function validateRecipe(input: unknown) {
	try {
		return Result.success(
			recipeSchema.validateSync(input, {
				strict: true,
				abortEarly: false,
				stripUnknown: true,
				disableStackTrace: true,
			}),
		);
	} catch (err) {
		return Result.failed(err as ValidationError);
	}
}

function semiParseObject(input: Record<string, unknown>, fieldNames: string[]) {
	const parsed = { ...input };

	for (const key of fieldNames) {
		const value = parsed[key];

		if (typeof value !== 'string') continue;

		try {
			parsed[key] = JSON.parse(value);
		} catch {
			/* empty */
		}
	}

	return parsed;
}

function isObject(input: unknown): input is Record<string, unknown> {
	return typeof input === 'object' && input !== null;
}

function parseRecipe(input: unknown) {
	const inputSemiParsed = isObject(input)
		? semiParseObject(input, ['ingredients', 'steps', 'timeSpent'])
		: input;

	return validateRecipe(
		recipeSchema.cast(inputSemiParsed, {
			assert: false,
			stripUnknown: true,
		}),
	);
}

export { parseRecipe };
