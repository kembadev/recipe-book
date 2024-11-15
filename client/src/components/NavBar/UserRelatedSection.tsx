import type { PrivateUser } from '@monorepo/shared';

import { RowAuthenticated } from './RowAuthenticated.tsx';
import { NoAuthFallback } from './NoAuthFallback.tsx';

interface NavBarUserInfoProps {
	userData: PrivateUser | null;
}

export function UserRelatedSection({ userData }: NavBarUserInfoProps) {
	return userData ? (
		<RowAuthenticated userData={userData} />
	) : (
		<NoAuthFallback />
	);
}
