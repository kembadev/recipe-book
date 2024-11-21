import type { TokenPayloadUser } from './users.ts';
import type {
	BadPayloadTokenError,
	TokenValidationError,
} from '../error-handling/token.ts';

type AccessTokenError = BadPayloadTokenError | TokenValidationError;

declare global {
	namespace Express {
		interface Request {
			session: AccessTokenError | TokenPayloadUser | null;
		}
	}
}
