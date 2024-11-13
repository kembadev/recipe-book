import type { PrivateUser } from '@monorepo/shared';

import { User } from './User.tsx';
import { Fallback } from './Fallback.tsx';

interface NavBarUserInfoProps {
	userData: PrivateUser | null;
}

export function NavBarUserInfo({ userData }: NavBarUserInfoProps) {
	return userData ? <User userData={userData} /> : <Fallback />;
}
