import type { AuthData } from '@src/types/auth.ts';

import { useOutletContext, Navigate } from 'react-router-dom';
import { SignInForm } from '@components/SignInForm/SignInForm.tsx';

Component.displayName = 'SignIn';

export function Component() {
	const data = useOutletContext<AuthData>();

	if (data.success) return <Navigate to="/" replace />;

	return (
		<div
			style={{
				display: 'grid',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<SignInForm />
		</div>
	);
}
