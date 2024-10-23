import { Router } from 'express';
import { recipesRouter } from './recipes.js';
import { usersRoute } from './users.js';

export const apiRouter = Router();

apiRouter.use('/recipes', recipesRouter);
apiRouter.use('/users', usersRoute);
