import type { User, PrivateUser } from '@monorepo/shared';
import type { Result } from '@monorepo/shared';
import type {
	PasswordValidationError,
	UsernameNotAvailableError,
} from '../error-handling/auth.js';

export interface TokenPayloadUser {
	id: string;
}

// Module

// ---
type ProvidedUserInfoRegister = Pick<User, 'name' | 'password'>;

export type CreateUser = (
	userInfo: ProvidedUserInfoRegister,
) => Promise<
	| Result<null, Error>
	| Result<null, UsernameNotAvailableError>
	| Result<null, null>
>;

// ---
type ProvidedUserInfoLogin = Pick<
	ProvidedUserInfoRegister,
	'name' | 'password'
>;

export type LoginUser = (
	userInfo: ProvidedUserInfoLogin,
) => Promise<
	| undefined
	| Result<null, Error>
	| Result<null, PasswordValidationError>
	| Result<{ userId: string }, null>
>;

// ---
type BasicAuthData = Pick<PrivateUser, 'name' | 'createdAt'> &
	Pick<User, 'avatar_filename'>;

export type GetAuthData = (
	userId: string,
) => Promise<Error | BasicAuthData | undefined>;

// ---
type UploadAvatarResult =
	| Result<null, Error>
	| Result<{ avatar_filename: string }, null>
	| undefined;

export type UploadAvatar = (props: {
	userId: string;
	file: Express.Multer.File;
}) => Promise<UploadAvatarResult>;
