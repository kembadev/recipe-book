import './NavBar.css';

import type { PrivateUser } from '@monorepo/shared';

import { useTheme } from '@common/hooks/useTheme.ts';

import { Link } from 'react-router-dom';
import { BarsIcon } from '@common/components/Icons.tsx';
import { SearchBar } from './SearchBar.tsx';
import { TogglableTheme } from '@common/components/TogglableTheme.tsx';
import { NavBarUserInfo } from './NavBarUserInfo.tsx';

interface NavBarProps {
	userData: PrivateUser | null;
}

export function NavBar({ userData }: NavBarProps) {
	const { theme } = useTheme();

	return (
		<nav className={`nav-bar ${theme}`}>
			<div className="nav-bar__start">
				<button>
					<BarsIcon />
				</button>
				<Link to="/">Home</Link>
			</div>
			<div className="nav-bar__end">
				<section className="nav-bar__recipes-search">
					<SearchBar />
				</section>
				<div>
					<TogglableTheme />
					<section>
						<NavBarUserInfo userData={userData} />
					</section>
				</div>
			</div>
		</nav>
	);
}
