import type { AuthData } from '@src/types/auth.ts';
import type { signInUserAction } from './action.ts';

import { useEffect } from 'react';
import { useActionData } from 'react-router-typesafe';

import { useOutletContext, Navigate } from 'react-router-dom';
import { SignInForm } from '@components/SignInForm/SignInForm.tsx';

Component.displayName = 'SignIn';

export function Component() {
	const data = useOutletContext<AuthData>();
	const actionErrorInfo = useActionData<typeof signInUserAction>();

	useEffect(() => {
		if (!actionErrorInfo) return;

		console.log({ actionErrorInfo });
	}, [actionErrorInfo]);

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
