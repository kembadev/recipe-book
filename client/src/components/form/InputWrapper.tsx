import './InputWrapper.css';

import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputBaseProps {
	label: string;
	validationMessage: string | null;
}

interface InputWrapperProps extends InputBaseProps {
	children: ReactNode;
	inputId: string;
	errorMessageId: string;
}

export interface ChildrenPropsHelper
	extends InputBaseProps,
		InputHTMLAttributes<HTMLInputElement> {
	updateValidationMessage: (errorMessage: string | null) => void;
}

/**
 * @param props
 * @param props.children - Component containing an HTMLInputElement inside
 */
export function InputWrapper({
	children,
	label,
	inputId,
	errorMessageId,
	validationMessage,
}: InputWrapperProps) {
	return (
		<section className="input-wrapper">
			<label htmlFor={inputId}>{label}</label>
			<div>
				{children}
				{validationMessage && (
					<em role="alert" aria-live="assertive" id={errorMessageId}>
						{validationMessage}
					</em>
				)}
			</div>
		</section>
	);
}
