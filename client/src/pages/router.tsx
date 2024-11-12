import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { Component, loader } from './Root';

const routes: RouteObject[] = [
	{
		index: true,
		lazy: () => import('./Home'),
	},
	{
		path: 'signup',
		lazy: () => import('./SignUp'),
	},
	{
		path: 'signin',
		lazy: () => import('./SignIn'),
	},
	{
		path: 'profile/:username',
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
];

const router = createBrowserRouter([
	{
		path: '/',
		element: <Component />,
		loader,
		children: routes,
	},
]);

export default router;
