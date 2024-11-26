import { render, screen } from '@testing-library/react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { NavBar } from './NavBar.tsx';

const router = createMemoryRouter(
	[
		{
			path: '/',
			element: <NavBar authData={null} />,
		},
	],
	{ initialEntries: ['/'] },
);

describe('NavBar component', () => {
	beforeEach(() => {
		render(<RouterProvider router={router} />);
	});

	it('should render', () => {
		screen.getByText(/sign in/i);
		screen.getByText(/sign up/i);
	});
});
