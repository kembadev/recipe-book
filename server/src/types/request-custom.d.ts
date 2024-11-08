import type { TokenPayloadUser } from './users.ts';

declare global {
	namespace Express {
		interface Request {
			session: Error | TokenPayloadUser | null;
		}
	}
}
