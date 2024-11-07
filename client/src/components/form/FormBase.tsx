import './FormBase.css';

import { FormEvent, ReactNode } from 'react';
import type { HTMLFormMethod } from '../../types/app.ts';

import { Form } from 'react-router-dom';

interface FormBaseProps {
	children: ReactNode;
	formLabel: string;
	submitLabel?: string;
	action?: string;
	method?: HTMLFormMethod;
	onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

export function FormBase({
	children,
	formLabel,
	submitLabel = 'Submit',
	action,
	method,
	onSubmit,
}: FormBaseProps) {
	return (
		<Form method={method} action={action} onSubmit={onSubmit}>
			<fieldset>
				<legend>{formLabel}</legend>
				{children}
				<button type="submit">{submitLabel}</button>
			</fieldset>
		</Form>
	);
}
