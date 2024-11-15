import { useMemo, type ReactNode } from 'react';

import { useLocation } from 'react-router-dom';

import { SignInLink } from './SignInLink.tsx';
import { SignUpLink } from './SignUpLink.tsx';

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

export function NoAuthFallback() {
	const { pathname } = useLocation();

	const FallbackByPath: (() => ReactNode) | undefined = useMemo(
		() => listOfFallbacks.find(({ path }) => path === pathname)?.Component,
		[pathname],
	);

	return FallbackByPath ? (
		<FallbackByPath />
	) : (
		<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
			<SignInLink />
			<SignUpLink />
		</div>
	);
}
