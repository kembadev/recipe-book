import './SignInForm.css';

import type { signInUserAction } from '@pages/SignIn/action.ts';

import { useCallback, FormEvent, useEffect } from 'react';
import { useError } from '@common/hooks/useError.ts';
import { useActionData } from 'react-router-typesafe';

import { UsernameValidation } from '@helpers/input-validation/username.ts';
import { PasswordValidation } from '@helpers/input-validation/password.ts';

import { FormBase } from '@common/components/FormBase.tsx';
import { TextInput } from '@common/components/TextInput.tsx';
import { PasswordInput } from '@common/components/PasswordInput.tsx';

export function SignInForm() {
	const actionErrorInfo = useActionData<typeof signInUserAction>();

	const [usernameValidation, updateUsernameValidation] = useError();
	const [passwordValidation, updatePasswordValidation] = useError();
	const [generalErrorMessage, updateGeneralErrorMessage] = useError();

	const handleOnUsernameChange = useCallback((username: unknown) => {
		const { success, error } = UsernameValidation.login(username);

		if (!success) return error.message;
	}, []);

	const handleOnPasswordChange = useCallback((password: unknown) => {
		if (typeof password === 'string' && password.length < 7) return;

		const { success, error } = PasswordValidation.login(password);

		if (!success) return error.message;
	}, []);

	const handleOnSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			const formData = new FormData(e.target as HTMLFormElement);
			const { name, password } = Object.fromEntries(formData);

			const usernameValidation = UsernameValidation.login(name);
			const passwordValidation = PasswordValidation.login(password);

			if (usernameValidation.success && passwordValidation.success) return;

			e.preventDefault();

			if (!usernameValidation.success) {
				updateUsernameValidation(usernameValidation.error.message);
			}

			if (!passwordValidation.success) {
				updatePasswordValidation(passwordValidation.error.message);
			}
		},
		[updateUsernameValidation, updatePasswordValidation],
	);

	useEffect(() => {
		if (!actionErrorInfo) return;

		const { status } = actionErrorInfo;

		if (status === 401) {
			return updatePasswordValidation('Invalid password.');
		}

		if (status === 404) {
			return updateUsernameValidation('User not found.');
		}

		setTimeout(() => {
			updateGeneralErrorMessage(null);
		}, 6000);

		if (status === 422) {
			return updateGeneralErrorMessage('Invalid data.');
		}

		if (status === 500) {
			return updateGeneralErrorMessage(
				'Something went wrong. Try again later.',
			);
		}

		updateGeneralErrorMessage('Unexpected error has occurred.');
	}, [
		actionErrorInfo,
		updatePasswordValidation,
		updateUsernameValidation,
		updateGeneralErrorMessage,
	]);

	return (
		<section className="user-login">
			<FormBase
				formLabel="Sign in"
				onSubmit={handleOnSubmit}
				generalErrorMessage={generalErrorMessage}
				method="post"
				action="/signin"
			>
				<TextInput
					label="Username"
					name="name"
					validationMessage={usernameValidation}
					updateValidationMessage={updateUsernameValidation}
					validateTextOnChange={handleOnUsernameChange}
					placeholder="Username"
					maxLength={14}
					autoComplete="on"
					spellCheck={false}
				/>
				<PasswordInput
					label="Password"
					name="password"
					validationMessage={passwordValidation}
					updateValidationMessage={updatePasswordValidation}
					validatePasswordOnChange={handleOnPasswordChange}
					placeholder="Password"
					maxLength={22}
					autoComplete="on"
					spellCheck={false}
				/>
			</FormBase>
		</section>
	);
}
