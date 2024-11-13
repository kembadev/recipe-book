import { screen } from '@testing-library/react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { renderWithThemeProvider } from '../../test-utils.tsx';

import { SignUpForm } from './SignUpForm.tsx';

const router = createMemoryRouter(
	[
		{
			path: '/signup',
			element: <SignUpForm />,
		},
	],
	{ initialEntries: ['/signup'] },
);

describe('SignUpForm component', () => {
	beforeEach(() => {
		renderWithThemeProvider(<RouterProvider router={router} />);
	});

	it('should render', () => {
		screen.getByText(/create account/i);
	});
});
