import type { CreateRecipe, GetById, GetAll } from '../types/recipes.js';
import type { Recipe } from '@monorepo/shared';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

import { ExtractFromRecipe } from '../helpers/ExtractFromRecipe.js';
import RecipesDB from '../db/local/recipes.mjs';
import UsersDB from '../db/local/users.mjs';

import { generateUniqueFilename } from '../helpers/generateUniqueFilename.js';
import sharp from 'sharp';
import { getTextComparator } from '../lib/textComparator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recipeImagePathUrl = path.join(__dirname, '../db/uploads/recipes-images');

if (!fs.existsSync(recipeImagePathUrl)) {
	fs.mkdirSync(recipeImagePathUrl, { recursive: true });
}

export class RecipesModule {
	static #recipesPerPage = 10;

	static create: CreateRecipe = async ({ data, userId, file }) => {
		const targetUser = await UsersDB.findOne(userId);

		if (targetUser instanceof Error) return targetUser;

		if (!targetUser) {
			return {
				success: false,
				errorMessage: 'User not found.',
			};
		}

		let filename: string | null = generateUniqueFilename() + '.jpg';
		const filePath = path.join(recipeImagePathUrl, filename);

		// try to save the image (and converting it)
		if (file?.buffer) {
			let manipulatedBuffer;

			try {
				manipulatedBuffer = await sharp(file.buffer)
					.resize({ width: 600, height: 600, fit: 'inside' })
					.jpeg()
					.toBuffer();
			} catch {
				return new Error('Something went wrong.');
			}

			await new Promise(resolve => {
				fs.writeFile(filePath, manipulatedBuffer, err => {
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

		// delete the image, if created, and return the error
		if (recipeId instanceof Error) {
			await new Promise(resolve => {
				if (fs.existsSync(filePath)) {
					return fs.unlink(filePath, resolve);
				}

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

		const baseValue = { id: recipeId, creator, image_filename };

		// independently if the recipe is either private or public, send
		// the full private recipe data because the requesting user owns it
		if (userId === recipeCreatorId) {
			const basePrivateRecipeData =
				ExtractFromRecipe.basePrivateData(recipeData);

			return {
				isPartialBody: false,
				value: { ...basePrivateRecipeData, ...baseValue },
			};
		}

		const basePublicRecipeData = ExtractFromRecipe.basePublicData(recipeData);

		return {
			isPartialBody: true,
			value: { ...basePublicRecipeData, ...baseValue },
		};
	};

	static getPreviews: GetAll = async ({ title, page }) => {
		const compareTitle = getTextComparator(title);

		const listOfBaseRecipePreviews = await RecipesDB.getAll(
			(id, recipeData) => {
				const { title: recipeTitle, createdBy, visibility } = recipeData;

				if (visibility === 'private' || !compareTitle(recipeTitle)) return;

				const baseRecipePreview = ExtractFromRecipe.basePreview(recipeData);

				return { id, createdBy, ...baseRecipePreview };
			},
			{ limit: 10, offset: (page - 1) * this.#recipesPerPage },
		);

		if (listOfBaseRecipePreviews instanceof Error) {
			return listOfBaseRecipePreviews;
		}

		const recipesOwnerId = listOfBaseRecipePreviews.map(
			({ createdBy }) => createdBy,
		);

		const recipesOwners = await UsersDB.getAll((id, { name }) => {
			if (recipesOwnerId.includes(id)) return { userId: id, name };
		});

		if (recipesOwners instanceof Error) return recipesOwners;

		const listOfRecipePreviews = listOfBaseRecipePreviews.map(
			({ id, createdBy, ...rest }) => {
				const owner = recipesOwners.find(({ userId }) => userId === createdBy);

				const creator = owner?.name ?? null;

				return { id, creator, ...rest };
			},
		);

		return listOfRecipePreviews;
	};
}
