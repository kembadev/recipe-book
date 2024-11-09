import './SignUpForm.css';

import { useCallback, FormEvent } from 'react';
import { useError } from '@common/hooks/useError.ts';

import { UsernameValidation } from '@helpers/input-validation/username.ts';
import { PasswordValidation } from '@helpers/input-validation/password.ts';

import { FormBase } from './FormBase.tsx';
import { TextInput } from './TextInput.tsx';
import { PasswordInput } from './PasswordInput.tsx';

export function SignUpForm() {
	const [usernameValidation, updateUsernameValidation] = useError();
	const [passwordValidation, updatePasswordValidation] = useError();

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

			const usernameValidation = UsernameValidation.registration(name);
			const passwordValidation = PasswordValidation.registration(password);

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
		<div className="user-registration">
			<FormBase
				formLabel="Create account"
				submitLabel="Create"
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
		</div>
	);
}
