import type { Recipe, PrivateRecipe, PublicRecipe } from '@monorepo/shared';
import type { RecipePreview } from '../types/recipes.js';

type BasePrivateRecipeData = Omit<PrivateRecipe, 'creator' | 'image_src'>;

type BasePublicRecipeData = Omit<PublicRecipe, 'creator' | 'image_src'>;

type BaseRecipePreview = Omit<RecipePreview, 'creator' | 'id' | 'image_src'> &
	Pick<Recipe, 'image_filename'>;

export class ExtractFromRecipe {
	static basePrivateData(recipeData: Recipe): BasePrivateRecipeData {
		const {
			title,
			description,
			ingredients,
			steps,
			timeSpent,
			recipeYield,
			visibility,
			createdAt,
			lastEdit,
		} = recipeData;

		return {
			title,
			description,
			ingredients,
			steps,
			timeSpent,
			recipeYield,
			visibility,
			createdAt,
			lastEdit,
		};
	}

	static basePublicData(recipeData: Recipe): BasePublicRecipeData {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { visibility, ...rest } = this.basePrivateData(recipeData);

		return { ...rest };
	}

	static basePreview(recipeData: Recipe): BaseRecipePreview {
		const {
			title,
			description,
			createdAt,
			image_filename,
			timeSpent: { cookTime, prepTime },
		} = recipeData;

		return {
			title,
			description: description.slice(0, 200),
			createdAt,
			image_filename,
			totalTimeSpent: prepTime + (cookTime ?? 0),
		};
	}
}
