import type { createUserAction } from './action.ts';

import { useActionData } from 'react-router-typesafe';
import { useEffect } from 'react';

import { SignUpForm } from '@components/form/SignUpForm.tsx';

Component.displayName = 'SignUp';

export function Component() {
	const actionData = useActionData<typeof createUserAction>();

	useEffect(() => {
		if (!actionData) return;

		console.log({ actionData });
	}, [actionData]);

	return (
		<div style={{ minHeight: '100%', display: 'grid' }}>
			<SignUpForm />
		</div>
	);
}
