import './SignInForm.css';

import { useCallback, FormEvent } from 'react';
import { useError } from '@common/hooks/useError.ts';

import { UsernameValidation } from '@helpers/input-validation/username.ts';
import { PasswordValidation } from '@helpers/input-validation/password.ts';

import { FormBase } from '@common/components/FormBase.tsx';
import { TextInput } from '@common/components/TextInput.tsx';
import { PasswordInput } from '@common/components/PasswordInput.tsx';

export function SignInForm() {
	const [usernameValidation, updateUsernameValidation] = useError();
	const [passwordValidation, updatePasswordValidation] = useError();

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

	return (
		<section className="user-login">
			<FormBase
				formLabel="Sign in"
				onSubmit={handleOnSubmit}
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
