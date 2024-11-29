import type {
	Recipe,
	PrivateRecipe,
	PublicRecipe,
	RecipePreview,
} from '@monorepo/shared';

type OmitFromRecipe = 'id' | 'creator' | 'image_src';

type BasePrivateRecipeData = Omit<PrivateRecipe, OmitFromRecipe>;

type BasePublicRecipeData = Omit<PublicRecipe, OmitFromRecipe>;

type BaseRecipePreview = Omit<RecipePreview, OmitFromRecipe> &
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
