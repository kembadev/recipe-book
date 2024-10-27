import './FormBase.css';

import { FormEvent, ReactNode } from 'react';

interface FormBaseProps {
	formLabel: string;
	submitLabel?: string;
	children: ReactNode;
	onSubmit: (e: FormEvent) => void;
}

export function FormBase({
	formLabel,
	submitLabel,
	children,
	onSubmit,
}: FormBaseProps) {
	return (
		<form onSubmit={onSubmit}>
			<fieldset>
				<legend>{formLabel}</legend>
				{children}
				<button type="submit">{submitLabel ?? 'Submit'}</button>
			</fieldset>
		</form>
	);
}
