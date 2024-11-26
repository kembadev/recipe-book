import type { PrivateUser } from '@monorepo/shared';
import type { getUserAuthLoader } from '@pages/Root/loader.ts';

export type AuthData = Pick<PrivateUser, 'name' | 'createdAt' | 'avatar_src'>;

export type ResultAuthData = Awaited<ReturnType<typeof getUserAuthLoader>>;
