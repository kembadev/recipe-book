import { Router } from 'express';
import { UsersController } from '../controller/users.js';

export const usersRoute = Router();

usersRoute.post('/register', UsersController.create);
usersRoute.post('/login', UsersController.login);
// usersRoute.post('/logout', UserController.logout);
