import type {
	RecipeSchema,
	Recipe,
	PrivateRecipe,
	PublicRecipe,
	RecipePreview,
} from '@monorepo/shared';

// Module

// --
export type CreateRecipe = (info: {
	data: RecipeSchema;
	userId: string;
	file?: Express.Multer.File;
}) => Promise<
	| Error
	| { success: false; errorMessage: string }
	| {
			success: true;
			value: Pick<Recipe, 'createdAt'> & {
				id: string;
				filename: Recipe['image_filename'];
			};
	  }
>;

// --
type ImageFileName = Pick<Recipe, 'image_filename'>;

type BasePublicRecipeData = Omit<PublicRecipe, 'image_src'> & ImageFileName;
type BasePrivateRecipeData = Omit<PrivateRecipe, 'image_src'> & ImageFileName;

export type GetById = (info: {
	recipeId: string;
	userId?: string;
}) => Promise<
	| Error
	| undefined
	| { isPartialBody: true; value: BasePublicRecipeData }
	| { isPartialBody: false; value: BasePrivateRecipeData }
>;

// --
type BaseRecipePreview = Omit<RecipePreview, 'image_src'> & ImageFileName;

export type GetAll = (props: {
	title: string;
	page: number;
}) => Promise<Error | BaseRecipePreview[]>;
