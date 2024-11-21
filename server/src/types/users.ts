import type { User, PrivateUser } from '@monorepo/shared';
import type { Result } from '@monorepo/shared';
import type { UploadError } from '../error-handling/upload.js';

export interface TokenPayloadUser {
	id: string;
}

// Module

type ProvidedUserInfoRegister = Pick<User, 'name' | 'password'>;
type ProvidedUserInfoLogin = Pick<User, 'name' | 'password'>;

export type CreateUser = (userInfo: ProvidedUserInfoRegister) => Promise<
	| Error
	| { success: true }
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

type UploadAvatarResult =
	| Result<null, Error>
	| Result<{ filename: string }, null>
	| undefined;

export type UploadAvatar = (props: {
	userId: string;
	file: Express.Multer.File;
}) => Promise<UploadAvatarResult | Result<null, UploadError>>;
