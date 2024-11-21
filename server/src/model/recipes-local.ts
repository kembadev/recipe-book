import type { CreateRecipe, GetById } from '../types/recipes.js';
import type { Recipe } from '@monorepo/shared';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

import { ExtractFromRecipe } from '../helpers/ExtractFromRecipe.js';
import RecipesDB from '../db/local/recipes.mjs';
import UsersDB from '../db/local/users.mjs';

import { generateUniqueFilename } from '../helpers/generateUniqueFilename.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recipeImagePathUrl = path.join(__dirname, '../db/uploads/recipes-images');

if (!fs.existsSync(recipeImagePathUrl)) {
	fs.mkdirSync(recipeImagePathUrl, { recursive: true });
}

export class RecipesModule {
	static create: CreateRecipe = async ({ data, userId, file }) => {
		const targetUser = await UsersDB.findOne(userId);

		if (targetUser instanceof Error) return targetUser;

		if (!targetUser) {
			return {
				success: false,
				errorMessage: 'User not found.',
			};
		}

		let filename = file?.originalname
			? generateUniqueFilename(file.originalname)
			: null;

		const filePath = filename ? path.join(recipeImagePathUrl, filename) : null;

		if (filePath) {
			await new Promise(resolve => {
				fs.writeFile(filePath, file!.buffer, err => {
					if (err) filename = null;

					resolve(null);
				});
			});
		}

		const creationDate = new Date().toISOString();
		const recipe: Recipe = {
			...data,
			image_filename: filename,
			createdBy: userId,
			createdAt: creationDate,
			lastEdit: creationDate,
		};

		const recipeId = await RecipesDB.addOne(recipe);

		if (recipeId instanceof Error) {
			await new Promise(resolve => {
				if (filePath) fs.rmdir(filePath, resolve);

				resolve(null);
			});

			return recipeId;
		}

		// add the recipe id to the user data
		await UsersDB.updateOne(userId, userData => ({
			...userData,
			createdRecipes: [...userData.createdRecipes, recipeId],
		}));

		return {
			success: true,
			value: {
				id: recipeId,
				filename,
				createdAt: recipe.createdAt,
			},
		};
	};

	static getById: GetById = async ({ recipeId, userId }) => {
		const recipe = await RecipesDB.findOne(recipeId);

		if (recipe instanceof Error || !recipe) return recipe;

		const recipeData = recipe[1];

		const {
			createdBy: recipeCreatorId,
			visibility,
			image_filename,
		} = recipeData;

		// if the recipe is private and the requesting user is not the owner
		if (userId !== recipeCreatorId && visibility === 'private') return;

		const recipeOwner = await UsersDB.findOne(recipeCreatorId);

		if (recipeOwner instanceof Error) return recipeOwner;

		const creator = recipeOwner?.[1].name ?? null;

		// independently if the recipe is either private or public,
		// send the full recipe because it owns to the requesting user
		if (userId === recipeCreatorId) {
			const basePrivateRecipeData =
				ExtractFromRecipe.basePrivateData(recipeData);

			return {
				isPartialBody: false,
				value: { ...basePrivateRecipeData, image_filename, creator },
			};
		}

		const basePublicRecipeData = ExtractFromRecipe.basePublicData(recipeData);

		return {
			isPartialBody: true,
			value: { ...basePublicRecipeData, image_filename, creator },
		};
	};
}
