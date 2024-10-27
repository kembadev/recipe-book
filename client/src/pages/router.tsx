import { createBrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';

const router = createBrowserRouter([
	{
		path: '/',
		async lazy() {
			const { Home } = await import('./Home');

			return { Component: Home };
		},
	},
	{
		path: '/profile',
		async lazy() {
			const { Profile } = await import('./Profile');

			return { Component: Profile };
		},
	},
	{
		path: '/register',
		async lazy() {
			const { Register, ErrorBoundary } = await import('./Register');

			return {
				Component: Register,
				errorElement: <ErrorBoundary />,
			};
		},
	},
	{
		path: '*',
		element: <NotFound />,
	},
]);

export default router;
