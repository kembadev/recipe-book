import { Router } from 'express';

import { UsersController } from '../controller/users.js';
import { authorizationMiddleware } from '../middlewares/authorization.js';
import {
	processImageUpload,
	processImageUploadErrorHandling,
} from '../middlewares/processImageUpload.js';

export const usersRouter = Router();

usersRouter.post('/register', UsersController.create);
usersRouter.post('/login', UsersController.login);
usersRouter.post('/logout', UsersController.logout);
usersRouter.post(
	'/avatar',
	authorizationMiddleware,
	processImageUpload.single('avatar_image'),
	processImageUploadErrorHandling,
	UsersController.uploadAvatar,
);

// usersRouter.delete('/', UsersController.delete);

usersRouter.get('/auth', authorizationMiddleware, UsersController.getInfo);
// usersRouter.get('/:username', UsersController.getProfile);
