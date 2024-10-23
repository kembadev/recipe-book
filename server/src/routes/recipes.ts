import { Router } from 'express';
import { RecipesController } from '../controller/recipes.js';

export const recipesRouter = Router();

recipesRouter.get('/', RecipesController.getAll);
