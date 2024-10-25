import type { PublicUser } from './users.ts';

declare global {
	namespace Express {
		interface Request {
			session: { user: PublicUser | null };
		}
	}
}
