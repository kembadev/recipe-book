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
		path: '/profile/:username',
		lazy: () => import('./Profile'),
	},
	// {
	// 	path: '/recipes',
	// 	lazy: () => import('./Recipes'),
	// },
	// {
	// 	path: '/recipes/:id',
	// 	lazy: () => import('./Recipe'),
	// },
	{
		path: '*',
		lazy: () => import('./NotFound'),
	},
]);

export default router;
