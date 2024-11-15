import { render, screen } from '@testing-library/react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { SignInForm } from './SignInForm.tsx';

const router = createMemoryRouter(
	[
		{
			path: '/signin',
			element: <SignInForm />,
		},
	],
	{ initialEntries: ['/signin'] },
);

describe('SignInForm component', () => {
	beforeEach(() => {
		render(<RouterProvider router={router} />);
	});

	it('should render', () => {
		screen.getByText(/sign in/i);
	});
});
