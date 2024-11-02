import type { Recipe, CreateRecipe, GetById } from '../types/recipes.js';

import RecipesDB from '../db/local/recipes.mjs';
import UsersDB from '../db/local/users.mjs';

export class RecipesModule {
	static create: CreateRecipe = async ({ data, userId }) => {
		const targetUser = await UsersDB.findOne(userId);

		if (targetUser instanceof Error) return targetUser;

		if (targetUser === undefined) {
			return {
				success: false,
				errorMessage: 'User not found.',
			};
		}

		const creationDate = new Date().toISOString();
		const recipe: Recipe = {
			...data,
			createdBy: userId,
			createdAt: creationDate,
			lastEdit: creationDate,
		};

		const recipeId = await RecipesDB.addOne(recipe);

		if (recipeId instanceof Error) return recipeId;

		await UsersDB.updateOne(userId, userData => ({
			...userData,
			createdRecipes: [...userData.createdRecipes, recipeId],
		}));

		return {
			success: true,
			value: {
				id: recipeId,
				createdAt: recipe.createdAt,
			},
		};
	};

	static getById: GetById = async ({ recipeId, userId }) => {
		const recipe = await RecipesDB.findOne(recipeId);

		if (recipe instanceof Error) return recipe;

		if (recipe === undefined) return;

		const recipeData = recipe[1];

		if (
			userId !== recipeData.createdBy &&
			recipeData.visibility === 'private'
		) {
			return;
		}

		const recipeOwner = await UsersDB.findOne(recipeData.createdBy);

		if (recipeOwner instanceof Error) return recipeOwner;

		if (userId === recipeData.createdBy) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { createdBy, ...rest } = recipeData;

			return {
				isPartialBody: false,
				value: rest,
			};
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { createdBy, visibility, ...rest } = recipeData;

		return {
			isPartialBody: true,
			value: {
				...rest,
				creator: recipeOwner?.[1].name ?? null,
			},
		};
	};
}
