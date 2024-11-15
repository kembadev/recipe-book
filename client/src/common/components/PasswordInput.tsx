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
import { SVGWrapperButton } from './SVGWrapperButton.tsx';
import { OpenedEyeIcon, ClosedEyeIcon } from '@common/components/Icons.tsx';

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
	const prevIsPasswordVisible = useRef(isPasswordVisible);

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
		if (
			!inputRef.current ||
			// avoid focus when rendering for the first time
			prevIsPasswordVisible.current === isPasswordVisible
		) {
			return;
		}

		prevIsPasswordVisible.current = isPasswordVisible;

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
				<SVGWrapperButton
					type="button"
					size="small"
					onClick={changePasswordVisibility}
				>
					{isPasswordVisible ? <OpenedEyeIcon /> : <ClosedEyeIcon />}
				</SVGWrapperButton>
			</div>
		</InputWrapper>
	);
}
