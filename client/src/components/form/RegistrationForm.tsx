import './RegistrationForm.css';

import { useState, useId, FormEvent, useCallback, ChangeEvent } from 'react';
import { useError } from '@common/hooks/useError.ts';

import { UsernameValidation } from '@helpers/input-validation/username.ts';
import { PasswordValidation } from '@helpers/input-validation/password.ts';

import { FormBase } from './FormBase.tsx';
import { ClosedEye, OpenedEye } from '@common/components/Icons.tsx';

export function RegistrationForm() {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [usernameValidation, updateUsernameValidation] = useError();
	const [passwordValidation, updatePasswordValidation] = useError();

	const usernameInputId = useId();
	const usernameErrorMessageId = useId();

	const passwordInputId = useId();
	const passwordErrorMessageId = useId();

	const handleOnUsernameChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { success, error } = UsernameValidation.registration(
				e.target.value,
			);

			if (success) return updateUsernameValidation(null);

			updateUsernameValidation(error.message);
		},
		[updateUsernameValidation],
	);

	const changePasswordVisibility = useCallback(() => {
		setIsPasswordVisible(prev => !prev);
	}, []);

	const handleOnPasswordChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const password = e.target.value;

			if (password.length < 7) return;

			const { success, error } = PasswordValidation.registration(password);

			if (success) return updatePasswordValidation(null);

			updatePasswordValidation(error.message);
		},
		[updatePasswordValidation],
	);

	const handleOnSubmit = useCallback(
		(e: FormEvent) => {
			e.preventDefault();

			const formData = new FormData(e.target as HTMLFormElement);
			const { name, password } = Object.fromEntries(formData);

			const usernameValidation = UsernameValidation.registration(name);
			if (!usernameValidation.success) {
				return updateUsernameValidation(usernameValidation.error.message);
			}

			const passwordValidation = PasswordValidation.registration(password);
			if (!passwordValidation.success) {
				return updatePasswordValidation(passwordValidation.error.message);
			}

			//
			// TODO: separate request methods
			fetch('/api/users/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					password,
				}),
			})
				.then(res => {
					if (res.ok) return res.json();
				})
				.then(data => {
					// TODO: validate parsed data
					console.log({ data });
				})
				.catch(console.error);
		},
		[updateUsernameValidation, updatePasswordValidation],
	);

	return (
		<div className="user-registration">
			<FormBase
				formLabel="Create account"
				submitLabel="Create"
				onSubmit={handleOnSubmit}
			>
				<section>
					<label htmlFor={usernameInputId}>Username</label>
					<div className="user-registration__username">
						<input
							id={usernameInputId}
							name="name"
							type="text"
							maxLength={14}
							autoComplete="off"
							spellCheck={false}
							placeholder="Username"
							aria-errormessage={usernameErrorMessageId}
							onChange={handleOnUsernameChange}
						/>
						{usernameValidation && (
							<em
								role="alert"
								aria-live="assertive"
								id={usernameErrorMessageId}
							>
								{usernameValidation}
							</em>
						)}
					</div>
				</section>
				<section>
					<label htmlFor={passwordInputId}>Password</label>
					<div className="user-registration__password">
						<div>
							<input
								id={passwordInputId}
								name="password"
								type={isPasswordVisible ? 'text' : 'password'}
								maxLength={22}
								autoComplete="off"
								spellCheck={false}
								placeholder="Password"
								aria-errormessage={passwordErrorMessageId}
								onChange={handleOnPasswordChange}
							/>
							<button
								type="button"
								className="user-registration__password--visibility-btn"
								onClick={changePasswordVisibility}
							>
								{isPasswordVisible ? <ClosedEye /> : <OpenedEye />}
							</button>
						</div>
						{passwordValidation && (
							<em
								role="alert"
								aria-live="assertive"
								id={passwordErrorMessageId}
							>
								{passwordValidation}
							</em>
						)}
					</div>
				</section>
			</FormBase>
		</div>
	);
}
