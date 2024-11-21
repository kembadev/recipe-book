import type { RequestHandler } from 'express';
import type { TokenPayloadUser } from '../types/users.js';

import { ResponseSchema, ERROR_CODES } from '@monorepo/shared';
import { RecipesModule } from '../model/recipes-local.js';
import { validateRecipe } from '../schemas/recipes.js';

export class RecipesController {
	static create: RequestHandler = async (req, res) => {
		const { success: isValidRecipe, error, data } = validateRecipe(req.body);

		if (!isValidRecipe) {
			res.status(422).json(
				ResponseSchema.failed({
					message: 'Invalid request body format.',
					errorCode: ERROR_CODES.INVALID_PARAMS,
					details: JSON.parse(error.message),
				}),
			);

			return;
		}

		const { id: userId } = req.session as TokenPayloadUser;

		const result = await RecipesModule.create({ data, userId, file: req.file });

		if (result instanceof Error) {
			res.status(500).json(
				ResponseSchema.failed({
					message: 'Could not create the recipe.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		// maybe the userId didn't match any in the db
		if (!result.success) {
			res.status(404).json(
				ResponseSchema.failed({
					message: result.errorMessage,
					errorCode: ERROR_CODES.NOT_FOUND,
				}),
			);

			return;
		}

		const { filename, id, createdAt } = result.value;
		const image_src = filename ? `/images/recipes/${filename}` : null;

		res.status(201).json(
			ResponseSchema.success({
				data: { id, createdAt, image_src },
			}),
		);
	};

	static getById: RequestHandler = async (req, res) => {
		const user = req.session;
		const isUser = !(user instanceof Error) && user !== null;
		const userId = isUser ? user.id : undefined;

		const recipeId = req.params.id;

		const result = await RecipesModule.getById({ recipeId, userId });

		if (result instanceof Error) {
			res.status(500).json(
				ResponseSchema.failed({
					message: 'Something went wrong.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		if (result === undefined) {
			res.status(404).json(
				ResponseSchema.failed({
					message: 'Recipe not found.',
					errorCode: ERROR_CODES.NOT_FOUND,
				}),
			);

			return;
		}

		const { image_filename, ...rest } = result.value;

		const image_src = image_filename
			? `/images/recipes/${image_filename}`
			: null;

		const data = { image_src, ...rest };

		if (result.isPartialBody) {
			res.status(206).json(ResponseSchema.success({ data }));

			return;
		}

		res.json(ResponseSchema.success({ data }));
	};
}
