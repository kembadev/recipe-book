import './NavBar.css';

import type { PrivateUser } from '@monorepo/shared';

import { useMemo } from 'react';
import { useTheme } from '@common/hooks/useTheme.ts';
import { Link, useLocation } from 'react-router-dom';

import { SearchIcon } from '@common/components/Icons.tsx';
import { TogglableTheme } from '@common/components/TogglableTheme.tsx';

interface NavBarProps {
	userData: PrivateUser | null;
}

export function NavBar({ userData }: NavBarProps) {
	const { theme } = useTheme();
	const { pathname } = useLocation();

	const userAssociated = useMemo(() => {
		if (userData) return userData.name;

		if (pathname === '/signup') {
			return 'sign in';
		}

		if (pathname === '/signin') {
			return 'sign up';
		}

		return 'sign in | sign up';
	}, [userData, pathname]);

	return (
		<nav className={`nav-bar ${theme}`}>
			<div>
				<button>Bar</button>
				<Link to="/">Home</Link>
			</div>
			<section className="nav-bar__recipes-search">
				<form>
					<input
						className={theme}
						name="search"
						placeholder="type recipe to search for"
						type="text"
					/>
					<button>
						<SearchIcon />
					</button>
				</form>
			</section>
			<section className="nav-bar__user">
				<TogglableTheme />
				<span>{userAssociated}</span>
			</section>
		</nav>
	);
}
