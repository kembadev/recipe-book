import type { InferType } from 'yup';
import type { recipeSchema } from '../schemas/recipes.js';

export type RecipeSchema = InferType<typeof recipeSchema>;

export interface Recipe extends RecipeSchema {
	image_filename: string | null;
	createdBy: string;
	createdAt: string;
	lastEdit: string;
}

export type PrivateRecipe = Pick<
	Recipe,
	| 'title'
	| 'description'
	| 'ingredients'
	| 'steps'
	| 'createdAt'
	| 'lastEdit'
	| 'timeSpent'
	| 'recipeYield'
	| 'visibility'
> & {
	id: string;
	creator: string | null;
	image_src: Recipe['image_filename'];
};

export type PublicRecipe = Omit<PrivateRecipe, 'visibility'>;

export type RecipePreview = Pick<
	PrivateRecipe,
	'id' | 'title' | 'description' | 'createdAt' | 'creator' | 'image_src'
> & {
	totalTimeSpent: number;
};
