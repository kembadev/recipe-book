import type { AuthData } from '@src/types/auth.ts';

import { RowAuthenticated } from './RowAuthenticated.tsx';
import { NoAuthFallback } from './NoAuthFallback.tsx';

interface NavBarUserInfoProps {
	authData: AuthData | null;
}

export function UserRelatedSection({ authData }: NavBarUserInfoProps) {
	return authData ? (
		<RowAuthenticated authData={authData} />
	) : (
		<NoAuthFallback />
	);
}
