import { Router } from 'express';
import { RecipesController } from '../controller/recipes.js';
import {
	processRecipe,
	processRecipeErrorHandling,
} from '../middlewares/processRecipe.js';

export const recipesRouter = Router();

recipesRouter.post(
	'/',
	processRecipe,
	RecipesController.create,
	processRecipeErrorHandling,
);

// recipesRouter.get('/', RecipesController.getAll);
recipesRouter.get('/:id', RecipesController.getById);

// recipesRouter.patch('/:id', RecipesController.updateById)

// recipesRouter.delete('/:id', RecipesController.deleteById)
