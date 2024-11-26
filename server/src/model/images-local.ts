import type { MayUserViewRecipe } from '../types/images.js';

import RecipesDB from '../db/local/recipes.mjs';

import { Result } from '@monorepo/shared';
import { UnauthorizedError } from '../error-handling/auth.js';

export class ImagesModule {
	static mayUserViewRecipe: MayUserViewRecipe = async ({
		filename,
		userId,
	}) => {
		const recipe = await RecipesDB.findOne(
			(_id, { image_filename }) => image_filename === filename,
		);

		if (!recipe) return;

		if (recipe instanceof Error) return Result.failed(recipe);

		const { visibility, createdBy } = recipe[1];

		if (visibility === 'public' || createdBy === userId) {
			return Result.success(null);
		}

		return Result.failed(new UnauthorizedError('Access denied.'));
	};
}
