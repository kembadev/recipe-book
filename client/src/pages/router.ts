import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
	{
		path: '/',
		lazy: () => import('./Home'),
	},
	{
		path: '/signup',
		lazy: () => import('./SignUp'),
	},
	{
		path: '/signin',
		lazy: () => import('./SignIn'),
	},
	{
		path: '/:username',
		lazy: () => import('./Profile'),
	},
	{
		path: '*',
		lazy: () => import('./NotFound'),
	},
]);

export default router;
