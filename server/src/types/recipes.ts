import type { RecipeSquema } from '../schemas/recipes.js';

export interface Recipe extends RecipeSquema {
	createdBy: string;
	createdAt: string;
	lastEdit: string;
}

export type PublicRecipe = Omit<Recipe, 'createdBy' | 'visibility'> & {
	creator: string | null;
};

// Module

export type CreateRecipe = (info: {
	data: RecipeSquema;
	userId: string;
}) => Promise<
	| Error
	| { success: false; errorMessage: string }
	| { success: true; value: Pick<Recipe, 'createdAt'> & { id: string } }
>;

export type GetById = (info: {
	recipeId: string;
	userId: string | undefined;
}) => Promise<
	| Error
	| undefined
	| { isPartialBody: true; value: PublicRecipe }
	| { isPartialBody: false; value: Recipe }
>;
