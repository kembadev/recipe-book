import './SignUpForm.css';

import type { createUserAction } from '@pages/SignUp/action.ts';

import { useCallback, FormEvent, useEffect } from 'react';
import { useError } from '@common/hooks/useError.ts';
import { useActionData } from 'react-router-typesafe';

import { UsernameValidation } from '@helpers/input-validation/username.ts';
import { PasswordValidation } from '@helpers/input-validation/password.ts';

import { FormBase } from '@common/components/FormBase.tsx';
import { TextInput } from '@common/components/TextInput.tsx';
import { PasswordInput } from '@common/components/PasswordInput.tsx';

export function SignUpForm() {
	const actionErrorInfo = useActionData<typeof createUserAction>();

	const [usernameValidation, updateUsernameValidation] = useError();
	const [passwordValidation, updatePasswordValidation] = useError();
	const [generalErrorMessage, updateGeneralErrorMessage] = useError();

	const handleOnUsernameChange = useCallback((username: unknown) => {
		const { success, error } = UsernameValidation.registration(username);

		if (!success) return error.message;
	}, []);

	const handleOnPasswordChange = useCallback((password: unknown) => {
		if (typeof password === 'string' && password.length < 7) return;

		const { success, error } = PasswordValidation.registration(password);

		if (!success) return error.message;
	}, []);

	const handleOnSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			const formData = new FormData(e.target as HTMLFormElement);
			const { name, password } = Object.fromEntries(formData);

			const { success: isValidUsername, error: usernameValidationError } =
				UsernameValidation.registration(name);
			const { success: isValidPassword, error: passwordValidationError } =
				PasswordValidation.registration(password);

			if (isValidUsername && isValidPassword) return;

			e.preventDefault();

			if (!isValidUsername) {
				updateUsernameValidation(usernameValidationError.message);
			}

			if (!isValidPassword) {
				updatePasswordValidation(passwordValidationError.message);
			}
		},
		[updateUsernameValidation, updatePasswordValidation],
	);

	useEffect(() => {
		if (!actionErrorInfo) return;

		const { status } = actionErrorInfo;

		if (status === 409) {
			return updateUsernameValidation('This user already exists.');
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
	}, [actionErrorInfo, updateUsernameValidation, updateGeneralErrorMessage]);

	return (
		<section className="user-registration">
			<FormBase
				formLabel="Create account"
				submitLabel="Create"
				generalErrorMessage={generalErrorMessage}
				onSubmit={handleOnSubmit}
				method="post"
				action="/signup"
			>
				<TextInput
					label="Username"
					name="name"
					validationMessage={usernameValidation}
					updateValidationMessage={updateUsernameValidation}
					validateTextOnChange={handleOnUsernameChange}
					placeholder="Username"
					maxLength={14}
					autoComplete="off"
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
					autoComplete="off"
					spellCheck={false}
				/>
			</FormBase>
		</section>
	);
}
