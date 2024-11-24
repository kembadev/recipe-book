import type { Recipe, PrivateRecipe, PublicRecipe } from '@monorepo/shared';

type BasePrivateRecipeData = Omit<PrivateRecipe, 'creator' | 'image_src'>;

type BasePublicRecipeData = Omit<PublicRecipe, 'creator' | 'image_src'>;

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
}
