import type z from 'zod';
import type { recipeSchema } from '../schemas/recipes.js';

export type RecipeSchema = z.infer<typeof recipeSchema>;

export interface Recipe extends RecipeSchema {
	image_url: string | null;
	createdBy: string;
	createdAt: string;
	lastEdit: string;
}

export type PrivateRecipe = Omit<Recipe, 'createdBy'> & {
	creator: string | null;
};

export type PublicRecipe = Omit<PrivateRecipe, 'visibility'>;
