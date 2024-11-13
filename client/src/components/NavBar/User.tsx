import type { PrivateUser } from '@monorepo/shared';

interface UserProps {
	userData: PrivateUser;
}

export function User({ userData }: UserProps) {
	return <span>{userData.name}</span>;
}
