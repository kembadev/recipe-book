import './styles.css';

import type { getUserAuthLoader } from './loader.ts';

import { useLoaderData } from 'react-router-typesafe';
import { useTheme } from '@common/hooks/useTheme.ts';

import { Outlet } from 'react-router-dom';
import { NavBar } from '@components/NavBar';

export function Root() {
	const { theme } = useTheme();
	const data = useLoaderData<typeof getUserAuthLoader>();

	return (
		<div className={`page ${theme}`}>
			<header className="page__nav-bar">
				<NavBar userData={data.value} />
			</header>
			<main className="page__content">
				<Outlet context={data} />
			</main>
		</div>
	);
}
