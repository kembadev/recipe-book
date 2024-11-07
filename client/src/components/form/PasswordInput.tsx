import './PasswordInput.css';

import { ChangeEvent, useCallback, useId, useState } from 'react';

import { InputWrapper, type ChildrenPropsHelper } from './InputWrapper.tsx';
import { OpenedEye, ClosedEye } from '@common/components/Icons.tsx';

interface PasswordInputProps extends ChildrenPropsHelper {
	validatePasswordOnChange: (password: unknown) => void | string;
}

export function PasswordInput({
	label,
	validatePasswordOnChange,
	validationMessage,
	updateValidationMessage,
	...props
}: PasswordInputProps) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const inputId = useId();
	const errorMessageId = useId();

	const handleOnPasswordChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const message = validatePasswordOnChange(e.target.value) ?? null;

			updateValidationMessage(message);
		},
		[updateValidationMessage, validatePasswordOnChange],
	);

	const changePasswordVisibility = useCallback(() => {
		setIsPasswordVisible(prev => !prev);
	}, []);

	return (
		<InputWrapper
			label={label}
			inputId={inputId}
			errorMessageId={errorMessageId}
			validationMessage={validationMessage}
		>
			<div className="input-field__password-wrapper">
				<input
					{...props}
					type={isPasswordVisible ? 'text' : 'password'}
					id={inputId}
					aria-errormessage={errorMessageId}
					onChange={handleOnPasswordChange}
				/>
				<button
					type="button"
					className="input-field__password--visibility-btn"
					onClick={changePasswordVisibility}
				>
					{isPasswordVisible ? <OpenedEye /> : <ClosedEye />}
				</button>
			</div>
		</InputWrapper>
	);
}
