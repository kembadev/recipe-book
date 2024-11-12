import './styles.css';

import { useLoaderData } from 'react-router-typesafe';

import type { getUserAuthLoader } from './loader.ts';

import { Outlet } from 'react-router-dom';
import { NavBar } from '@components/menus/NavBar.tsx';

Component.displayName = 'Root';

export function Component() {
	const data = useLoaderData<typeof getUserAuthLoader>();

	if (data.error) console.error(data.error);

	return (
		<div className="page">
			<header className="page__nav-bar">
				<NavBar userData={data.value} />
			</header>
			<main className="page__content">
				<Outlet context={data} />
			</main>
		</div>
	);
}
