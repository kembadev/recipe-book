import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { Root, ErrorBoundary, loader } from './Root';

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
	// {
	// 	path: 'new-recipe',
	// 	lazy: () => import('./CreateRecipe'),
	// },
	// {
	// 	path: 'saved-recipes',
	// 	lazy: () => import('./SavedRecipes'),
	// },
	// {
	// 	path: 'recipes',
	// 	lazy: () => import('./Recipes'),
	// },
	// {
	// 	path: 'recipes/:id',
	// 	lazy: () => import('./SingleRecipe'),
	// },
	{
		path: 'profile/:username',
		lazy: () => import('./Profile'),
	},
	{
		path: '*',
		lazy: () => import('./NotFound'),
	},
];

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorBoundary />,
		loader,
		children: routes,
	},
]);

export default router;
