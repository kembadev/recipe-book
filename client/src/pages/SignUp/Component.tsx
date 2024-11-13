import type { createUserAction } from './action.ts';

import { useActionData } from 'react-router-typesafe';
import { useEffect } from 'react';

import { SignUpForm } from '@components/SignUpForm/SignUpForm.tsx';

Component.displayName = 'SignUp';

export function Component() {
	const actionErrorInfo = useActionData<typeof createUserAction>();

	useEffect(() => {
		if (!actionErrorInfo) return;

		console.log({ actionErrorInfo });
	}, [actionErrorInfo]);

	return (
		<div
			style={{
				display: 'grid',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<SignUpForm />
		</div>
	);
}
