import { Router } from 'express';
import { recipesRouter } from './recipes.js';
import { usersRouter } from './users.js';

export const apiRouter = Router();

apiRouter.use('/recipes', recipesRouter);
apiRouter.use('/users', usersRouter);
