import type { RecipeSquema } from '../schemas/recipes.js';

export interface Recipe extends RecipeSquema {
	image_url: string | null;
	createdBy: string;
	createdAt: string;
	lastEdit: string;
}

export type PrivateRecipe = Omit<Recipe, 'createdBy'>;

export type PublicRecipe = Omit<PrivateRecipe, 'createdBy' | 'visibility'> & {
	creator: string | null;
};

// Module

export type CreateRecipe = (info: {
	data: RecipeSquema & { image_url: string | null };
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
	| { isPartialBody: false; value: PrivateRecipe }
>;
