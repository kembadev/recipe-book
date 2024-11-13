import { useMemo, type ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

import { SignInLink } from './SignInLink.tsx';
import { SignUpLink } from './SignUpLink.tsx';
import { Otherwise } from './Otherwise.tsx';

const listOfFallbacks: { path: string; Component: () => ReactNode }[] = [
	{
		path: '/signup',
		Component: SignInLink,
	},
	{
		path: '/signin',
		Component: SignUpLink,
	},
];

export function Fallback() {
	const { pathname } = useLocation();

	const FallbackByPath: (() => ReactNode) | undefined = useMemo(
		() => listOfFallbacks.find(({ path }) => path === pathname)?.Component,
		[pathname],
	);

	return FallbackByPath ? <FallbackByPath /> : <Otherwise />;
}
