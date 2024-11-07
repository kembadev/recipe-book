import { makeAction } from 'react-router-typesafe';
import { redirect } from 'react-router-dom';
import { UsersAPI } from '@services/api/users.ts';

export const createUserAction = makeAction(async ({ request }) => {
	const formData = await request.formData();

	const name = formData.get('name');
	const password = formData.get('password');

	const signUpResult = await UsersAPI.signUp({ name, password });

	if (!signUpResult.ok) return { status: signUpResult.status };

	const signInResult = await UsersAPI.signIn({ name, password });

	if (!signInResult.ok) return redirect('/signin');

	return redirect('/');
});
