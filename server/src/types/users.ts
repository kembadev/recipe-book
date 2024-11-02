import type { UserRegisterSchema } from '../schemas/users.js';

export interface User extends UserRegisterSchema {
	createdAt: string;
	savedRecipes: string[];
	createdRecipes: string[];
}

export type PrivateUser = Pick<
	User,
	'name' | 'createdAt' | 'createdRecipes' | 'savedRecipes'
>;

export interface TokenPayloadUser {
	id: string;
}

export type PublicUser = Pick<
	PrivateUser,
	'name' | 'createdAt' | 'createdRecipes'
>;

// Module

type ProvidedUserInfoRegister = Pick<User, 'name' | 'password'>;
type ProvidedUserInfoLogin = Pick<User, 'name' | 'password'>;

export type CreateUser = (userInfo: ProvidedUserInfoRegister) => Promise<
	| Error
	| { success: true; value: PrivateUser }
	| {
			success: false;
			paramsError: Partial<Record<keyof ProvidedUserInfoRegister, string>>;
	  }
>;

export type LoginUser = (userInfo: ProvidedUserInfoLogin) => Promise<
	| Error
	| { success: true; value: { userData: PrivateUser; userId: string } }
	| {
			success: false;
			paramsError: Partial<Record<keyof ProvidedUserInfoLogin, string>>;
	  }
>;
