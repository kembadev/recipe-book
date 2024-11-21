import type z from 'zod';
import type { recipeSchema } from '../schemas/recipes.js';

export type RecipeSchema = z.infer<typeof recipeSchema>;

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
	| 'cook_time'
	| 'prep_time'
	| 'recipeYield'
	| 'visibility'
> & {
	creator: string | null;
	image_src: Recipe['image_filename'];
};

export type PublicRecipe = Omit<PrivateRecipe, 'visibility'>;
