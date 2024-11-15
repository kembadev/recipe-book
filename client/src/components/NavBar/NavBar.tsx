import './NavBar.css';

import type { PrivateUser } from '@monorepo/shared';

import { useState } from 'react';
import useThemeStore from '@stores/theme.ts';

import { BarsIcon } from '@common/components/Icons.tsx';
import { RecipeBookLink } from '@common/components/RecipeBookLink.tsx';
import { SearchBar } from './SearchBar.tsx';
import { SVGWrapperButton } from '@common/components/SVGWrapperButton.tsx';
import { SearchIcon, ArrowBackIcon } from '@common/components/Icons.tsx';
import { ThemeSwitcher } from '@common/components/ThemeSwitcher.tsx';
import { NavBarUserInfo } from './NavBarUserInfo.tsx';

interface NavBarProps {
	userData: PrivateUser | null;
}

export function NavBar({ userData }: NavBarProps) {
	const theme = useThemeStore(({ theme }) => theme);

	const [isOverlayVisible, setIsOverlayVisible] = useState(false);

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
					{/* search bar for large screens */}
					<div className="search-bar__wrapper">
						<SearchBar />
					</div>
					{/* toggle hidden search bar */}
					<SVGWrapperButton
						title="Search"
						onClick={() => setIsOverlayVisible(true)}
					>
						<SearchIcon />
					</SVGWrapperButton>
					{/* hidden search bar for small screens */}
					{isOverlayVisible && (
						<div className="overlay-search-bar__wrapper">
							<SVGWrapperButton onClick={() => setIsOverlayVisible(false)}>
								<ArrowBackIcon />
							</SVGWrapperButton>
							<SearchBar autoFocus />
						</div>
					)}
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
