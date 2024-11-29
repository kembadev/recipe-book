import type z from 'zod';
import type { userRegisterSchema } from '../schemas/users.js';

export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;

export interface User extends UserRegisterSchema {
	createdAt: string;
	savedRecipes: string[];
	createdRecipes: string[];
	avatar_filename: string | null;
}

export type PrivateUser = Pick<
	User,
	'name' | 'createdAt' | 'createdRecipes' | 'savedRecipes'
> & {
	avatar_src: User['avatar_filename'];
};

export type PublicUser = Omit<PrivateUser, 'savedRecipes'>;

export type AuthData = Pick<PrivateUser, 'name' | 'createdAt' | 'avatar_src'>;
