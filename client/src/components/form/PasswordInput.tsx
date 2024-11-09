import './PasswordInput.css';

import {
	ChangeEvent,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react';

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

	const inputRef = useRef<HTMLInputElement>(null);
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
		setIsPasswordVisible(!isPasswordVisible);
	}, [isPasswordVisible]);

	useEffect(() => {
		if (!inputRef.current) return;

		inputRef.current.focus();

		const { length } = inputRef.current.value;
		inputRef.current.setSelectionRange(length, length);
	}, [isPasswordVisible]);

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
					ref={inputRef}
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
