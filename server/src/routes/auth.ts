import { Router } from 'express';

import { AuthController } from '../controller/auth.js';
import { authorizationMiddleware } from '../middlewares/authorization.js';

export const authRouter = Router();

authRouter.get('/status', authorizationMiddleware, AuthController.getUserInfo);
