import type { User, PrivateUser } from '@monorepo/shared';

export interface TokenPayloadUser {
	id: string;
}

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

export type GetInfo = (
	userId: string,
) => Promise<Error | PrivateUser | undefined>;
