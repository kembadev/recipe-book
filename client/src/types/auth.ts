import type { getUserAuthLoader } from '@pages/Root/loader.ts';

export type ResultAuthData = Awaited<ReturnType<typeof getUserAuthLoader>>;
