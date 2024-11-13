import { type ChangeEvent, useCallback, useId } from 'react';

import { InputWrapper, type ChildrenPropsHelper } from './InputWrapper.tsx';

interface TextInputProps extends ChildrenPropsHelper {
	validateTextOnChange: (text: unknown) => void | string;
}

export function TextInput({
	label,
	validateTextOnChange,
	validationMessage,
	updateValidationMessage,
	...props
}: TextInputProps) {
	const inputId = useId();
	const errorMessageId = useId();

	const handleOnTextChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const message = validateTextOnChange(e.target.value) ?? null;

			updateValidationMessage(message);
		},
		[updateValidationMessage, validateTextOnChange],
	);

	return (
		<InputWrapper
			label={label}
			inputId={inputId}
			errorMessageId={errorMessageId}
			validationMessage={validationMessage}
		>
			<input
				{...props}
				type="text"
				id={inputId}
				aria-errormessage={errorMessageId}
				onChange={handleOnTextChange}
			/>
		</InputWrapper>
	);
}
