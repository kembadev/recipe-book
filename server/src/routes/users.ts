import { Router } from 'express';

import { UsersController } from '../controller/users.js';

import { authorizationMiddleware } from '../middlewares/authorization.js';
import { processSingleImageUpload } from '../middlewares/processImageUpload.js';
import { validateSingleImageFile } from '../middlewares/validateSingleImageFile.js';
import { handleFileProcessingError } from '../middlewares/fileProcessingError.js';

export const usersRouter = Router();

usersRouter.post('/register', UsersController.create);
usersRouter.post('/login', UsersController.login);
usersRouter.post('/logout', UsersController.logout);
usersRouter.post(
	'/avatar',
	authorizationMiddleware,
	processSingleImageUpload({
		fieldName: 'avatar_image',
		maxFields: 0,
	}),
	validateSingleImageFile(true),
	handleFileProcessingError,
	UsersController.uploadAvatar,
);

// usersRouter.delete('/', UsersController.delete);

usersRouter.get('/auth', authorizationMiddleware, UsersController.getAuthData);
// usersRouter.get('/:username', UsersController.getProfile);
