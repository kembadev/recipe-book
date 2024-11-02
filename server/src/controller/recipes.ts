import type { RequestHandler } from 'express';

import path from 'node:path';

import { ResponseSchema, ERROR_CODES } from '../helpers/ResponseSchema.js';
import { RecipesModule } from '../model/recipes-local.js';
import { validateRecipe } from '../schemas/recipes.js';

import { getRemoveFile } from '../helpers/getRemoveFile.js';

export class RecipesController {
	static create: RequestHandler = async (req, res) => {
		const destination = req.file?.destination;
		const filename = req.file?.filename;

		let removeImageFile: () => unknown = () => {};

		if (typeof destination === 'string' && typeof filename === 'string') {
			const imageFileUrl = path.join(destination, filename);
			removeImageFile = getRemoveFile(imageFileUrl);
		}

		const { success: isValidRecipe, error, data } = validateRecipe(req.body);

		if (!isValidRecipe) {
			removeImageFile();

			res.status(422).json(
				ResponseSchema.failed({
					message: 'Invalid request body format.',
					errorCode: ERROR_CODES.INVALID_PARAMS,
					details: JSON.parse(error.message),
				}),
			);

			return;
		}

		const user = req.session.user!;

		const result = await RecipesModule.create({
			data: {
				...data,
				image_url: filename ?? null,
			},
			userId: user.id,
		});

		if (result instanceof Error) {
			removeImageFile();

			res.status(500).json(
				ResponseSchema.failed({
					message: 'Could not create the recipe.',
					errorCode: ERROR_CODES.INTERNAL_ERROR,
				}),
			);

			return;
		}

		if (!result.success) {
			removeImageFile();

			res.status(400).json(
				ResponseSchema.failed({
					message: result.errorMessage,
					errorCode: ERROR_CODES.BAD_REQUEST,
				}),
			);

			return;
		}

		res.status(201).json(
			ResponseSchema.success({
				data: result.value,
			}),
		);
	};

	static getById: RequestHandler = async (req, res) => {
		const user = req.session.user;
		const recipeId = req.params.id;

		const result = await RecipesModule.getById({ recipeId, userId: user?.id });

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

		if (result.isPartialBody) {
			res.status(206).json(
				ResponseSchema.success({
					data: result.value,
				}),
			);

			return;
		}

		res.json(
			ResponseSchema.success({
				data: result.value,
			}),
		);
	};
}
