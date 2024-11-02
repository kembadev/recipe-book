import { Router } from 'express';
import { RecipesController } from '../controller/recipes.js';
import { authorizationMiddleware } from '../middlewares/authorization.js';
import {
	processRecipeMiddleware,
	processRecipeErrorMiddleware,
} from '../middlewares/processRecipe.js';

export const recipesRouter = Router();

recipesRouter.post(
	'/',
	authorizationMiddleware,
	processRecipeMiddleware,
	RecipesController.create,
	processRecipeErrorMiddleware,
);

// recipesRouter.get('/', RecipesController.getAll);
recipesRouter.get('/:id', RecipesController.getById);

// recipesRouter.patch('/:id', RecipesController.updateById)

// recipesRouter.delete('/:id', RecipesController.deleteById)
