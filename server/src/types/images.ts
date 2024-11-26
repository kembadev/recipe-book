import type { Result } from '@monorepo/shared';
import type { UnauthorizedError } from '../error-handling/auth.js';

// Module

// --
export type MayUserViewRecipe = (props: {
	filename: string;
	userId?: string;
}) => Promise<
	| undefined
	| Result<null, null>
	| Result<null, Error>
	| Result<null, UnauthorizedError>
>;
