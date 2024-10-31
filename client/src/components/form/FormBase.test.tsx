import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormBase } from './FormBase.tsx';
import { FormEvent } from 'react';

describe('FormBase', () => {
	const onSubmit = vi.fn((e: FormEvent) => {
		e.preventDefault();
	});

	const formLabel = 'login';

	beforeEach(() => {
		render(
			<FormBase formLabel={formLabel} onSubmit={onSubmit}>
				<label htmlFor="username">username</label>
				<input name="username" id="username" type="text" />
			</FormBase>,
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should render', () => {
		expect(screen.getByText(formLabel)).toBeDefined();
	});

	it('should submit the form', async () => {
		const usernameInput = screen.getByLabelText('username');
		userEvent.type(usernameInput, 'beltran');

		fireEvent.submit(usernameInput.closest('form')!);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledOnce();
		});
	});
});
