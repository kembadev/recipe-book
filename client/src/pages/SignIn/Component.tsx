import type { AuthData } from '@src/types/auth.ts';
import { useOutletContext, Navigate } from 'react-router-dom';

Component.displayName = 'SignIn';

export function Component() {
	const data = useOutletContext<AuthData>();

	if (data.success) return <Navigate to="/" replace />;

	return <h1>login</h1>;
}
