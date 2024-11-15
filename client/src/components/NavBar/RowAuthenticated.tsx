import type { PrivateUser } from '@monorepo/shared';

interface UserProps {
	userData: PrivateUser;
}

export function RowAuthenticated({ userData }: UserProps) {
	return <span>{userData.name}</span>;
}
