import { makeAction } from 'react-router-typesafe';
import { redirect } from 'react-router-dom';
import { UsersAPI } from '@services/api/users.ts';

export const signInUserAction = makeAction(async ({ request }) => {
	const formData = await request.formData();

	const name = formData.get('name');
	const password = formData.get('password');

	const { ok, status } = await UsersAPI.signIn({ name, password });

	if (ok) return redirect('/');

	return { status };
});
