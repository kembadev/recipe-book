import { Router } from 'express';

import { RecipesController } from '../controller/recipes.js';

import { authorizationMiddleware } from '../middlewares/authorization.js';
import { processSingleImageUpload } from '../middlewares/processImageUpload.js';
import { validateSingleImageFile } from '../middlewares/validateSingleImageFile.js';
import { handleFileProcessingError } from '../middlewares/fileProcessingError.js';

export const recipesRouter = Router();

recipesRouter.post(
	'/',
	authorizationMiddleware,
	processSingleImageUpload({
		fieldName: 'image',
		// 8 instead of 7 (non-file fields needed for a recipe). Since the image
		// field might not be a file (e.g. if it were null),
		// multer might consider the image field as non-file, and therefore
		// maxFields should include the image field in the count
		maxFields: 8,
		// since steps is the field which value is potentially the biggest
		// within the formdata (400 characters * 30 items ~12kb),
		// maxFieldSize is calculated basing on it (~ 12kb + 50%)
		maxFieldSize: 1.8e4,
	}),
	validateSingleImageFile(false),
	handleFileProcessingError,
	RecipesController.create,
);

recipesRouter.get('/previews', RecipesController.getPreviews);
recipesRouter.get('/:id', RecipesController.getById);

// recipesRouter.patch('/:id', RecipesController.updateById)

// recipesRouter.delete('/:id', RecipesController.deleteById)
