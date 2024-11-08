import type { PrivateUser } from './users.js';

export type GetUserInfo = (
	userId: string,
) => Promise<Error | PrivateUser | undefined>;
