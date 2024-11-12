import type z from 'zod';
import type { userRegisterSchema } from '../schemas/users.js';

export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;

export interface User extends UserRegisterSchema {
	createdAt: string;
	savedRecipes: string[];
	createdRecipes: string[];
}

export type PrivateUser = Pick<
	User,
	'name' | 'createdAt' | 'createdRecipes' | 'savedRecipes'
>;

export type PublicUser = Pick<
	PrivateUser,
	'name' | 'createdAt' | 'createdRecipes'
>;
