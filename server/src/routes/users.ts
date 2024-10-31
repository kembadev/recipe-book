import { Router } from 'express';
import { UsersController } from '../controller/users.js';

export const usersRouter = Router();

usersRouter.post('/register', UsersController.create);
usersRouter.post('/login', UsersController.login);
usersRouter.post('/logout', UsersController.logout);

// usersRouter.delete('/', UsersController.delete);

// usersRouter.get('/:username', UsersController.getProfile);
