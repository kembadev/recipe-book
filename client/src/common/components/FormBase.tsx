import './FormBase.css';

import type { HTMLFormMethod } from '@src/types/app.ts';
import type { FormEvent, ReactNode } from 'react';

import useThemeStore from '@stores/theme.ts';

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
	const theme = useThemeStore(({ theme }) => theme);

	return (
		<Form
			className="form-base"
			method={method}
			action={action}
			onSubmit={onSubmit}
		>
			<fieldset className={theme}>
				<legend>{formLabel}</legend>
				{children}
				<button type="submit">{submitLabel}</button>
			</fieldset>
		</Form>
	);
}
