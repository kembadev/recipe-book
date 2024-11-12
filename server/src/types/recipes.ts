import type {
	RecipeSchema,
	Recipe,
	PrivateRecipe,
	PublicRecipe,
} from '@monorepo/shared';

// Module

export type CreateRecipe = (info: {
	data: RecipeSchema & { image_url: string | null };
	userId: string;
}) => Promise<
	| Error
	| { success: false; errorMessage: string }
	| { success: true; value: Pick<Recipe, 'createdAt'> & { id: string } }
>;

export type GetById = (info: {
	recipeId: string;
	userId?: string;
}) => Promise<
	| Error
	| undefined
	| { isPartialBody: true; value: PublicRecipe }
	| { isPartialBody: false; value: PrivateRecipe }
>;
