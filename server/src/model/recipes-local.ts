import type { CreateRecipe, GetById } from '../types/recipes.js';
import type { Recipe } from '@monorepo/shared';

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

		const {
			createdBy: recipeCreatorId,
			visibility,
			...recipeRestData
		} = recipe[1];

		if (userId !== recipeCreatorId && visibility === 'private') {
			return;
		}

		const recipeOwner = await UsersDB.findOne(recipeCreatorId);

		if (recipeOwner instanceof Error) return recipeOwner;

		const creator = recipeOwner?.[1].name ?? null;

		if (userId === recipeCreatorId) {
			return {
				isPartialBody: false,
				value: {
					...recipeRestData,
					visibility,
					creator,
				},
			};
		}

		return {
			isPartialBody: true,
			value: { ...recipeRestData, creator },
		};
	};
}
