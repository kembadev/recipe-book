import { IS_DEVELOPMENT } from '../config.js';

import { Router } from 'express';

import { recipesRouter } from './recipes.js';
import { usersRouter } from './users.js';
import { apiDocsRouter } from './api-docs/index.js';

export const apiRouter = Router();

apiRouter.use('/recipes', recipesRouter);
apiRouter.use('/users', usersRouter);

if (IS_DEVELOPMENT) {
	apiRouter.use('/api-docs', apiDocsRouter);
}
