import './NavBar.css';

import type { PrivateUser } from '@monorepo/shared';

import useThemeStore from '@stores/theme.ts';

import { BarsIcon } from '@common/components/Icons.tsx';
import { RecipeBookLink } from '@common/components/RecipeBookLink.tsx';
import { SearchBar } from './SearchBar.tsx';
import { ThemeSwitcher } from '@common/components/ThemeSwitcher.tsx';
import { NavBarUserInfo } from './NavBarUserInfo.tsx';

interface NavBarProps {
	userData: PrivateUser | null;
}

export function NavBar({ userData }: NavBarProps) {
	const theme = useThemeStore(({ theme }) => theme);

	return (
		<nav className={`nav-bar ${theme}`}>
			<div className="nav-bar__start">
				<button>
					<BarsIcon />
				</button>
				<RecipeBookLink />
			</div>
			<div className="nav-bar__end">
				<section className="nav-bar__recipes-search">
					<SearchBar />
				</section>
				<div>
					<ThemeSwitcher />
					<section>
						<NavBarUserInfo userData={userData} />
					</section>
				</div>
			</div>
		</nav>
	);
}
