import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { renderWithThemeProvider } from '../../test-utils.tsx';

import { FormBase } from './FormBase.tsx';

const onSubmit = vi.fn();
const formLabel = 'login';

const router = createMemoryRouter([
	{
		path: '/',
		element: (
			<FormBase formLabel={formLabel} onSubmit={onSubmit}>
				<label htmlFor="username">username</label>
				<input name="username" id="username" type="text" />
			</FormBase>
		),
	},
]);

describe('FormBase component', () => {
	beforeEach(() => {
		renderWithThemeProvider(<RouterProvider router={router} />);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should render', () => {
		screen.getByText(formLabel);
	});

	it('should submit the form', async () => {
		const usernameInput = screen.getByLabelText('username');
		userEvent.type(usernameInput, 'beltran');

		fireEvent.submit(usernameInput.closest('form')!);

		expect(onSubmit).toHaveBeenCalledOnce();
	});
});
