import type { createUserAction } from './action.ts';

import { useActionData } from 'react-router-typesafe';
import { useEffect } from 'react';

import { SignUpForm } from '@components/form/SignUpForm.tsx';

export function Component() {
	const actionData = useActionData<typeof createUserAction>();

	useEffect(() => {
		if (!actionData) return;

		console.log({ actionData });
	}, [actionData]);

	return (
		<div style={{ alignSelf: 'center' }}>
			<SignUpForm />
		</div>
	);
}
