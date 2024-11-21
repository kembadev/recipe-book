import { Router } from 'express';

import { RecipesController } from '../controller/recipes.js';
import { authorizationMiddleware } from '../middlewares/authorization.js';
import {
	processImageUpload,
	processImageUploadErrorHandling,
} from '../middlewares/processImageUpload.js';

export const recipesRouter = Router();

recipesRouter.post(
	'/',
	authorizationMiddleware,
	processImageUpload.single('image'),
	processImageUploadErrorHandling,
	RecipesController.create,
);

// recipesRouter.get('/', RecipesController.getAll);
recipesRouter.get('/:id', RecipesController.getById);

// recipesRouter.patch('/:id', RecipesController.updateById)

// recipesRouter.delete('/:id', RecipesController.deleteById)
