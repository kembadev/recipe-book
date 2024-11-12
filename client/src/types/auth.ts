import type { getUserAuthLoader } from '@pages/Root/loader.ts';

export type AuthData = Awaited<ReturnType<typeof getUserAuthLoader>>;
