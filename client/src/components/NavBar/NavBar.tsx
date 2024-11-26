import './NavBar.css';

import type { AuthData } from '@src/types/auth.ts';

import { useId, useState } from 'react';
import useThemeStore from '@stores/theme.ts';

import { BarsIcon } from '@common/components/Icons.tsx';
import { RecipeBookLink } from '@common/components/RecipeBookLink.tsx';
import { SearchBar } from './SearchBar.tsx';
import { SVGWrapperButton } from '@common/components/SVGWrapperButton.tsx';
import { SearchIcon, ArrowBackIcon } from '@common/components/Icons.tsx';
import { ThemeSwitcher } from '@common/components/ThemeSwitcher.tsx';
import { UserRelatedSection } from './UserRelatedSection.tsx';

interface NavBarProps {
	authData: AuthData | null;
}

export function NavBar({ authData }: NavBarProps) {
	const theme = useThemeStore(({ theme }) => theme);

	const [isOverlayVisible, setIsOverlayVisible] = useState(false);

	const overlaySearchBarId = useId();

	return (
		<nav className={`nav-bar ${theme}`}>
			<div className="nav-bar__start">
				<SVGWrapperButton
					size="medium"
					aria-label="Open global navigation menu"
				>
					<BarsIcon />
				</SVGWrapperButton>
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
						size="medium"
						aria-label="Search a recipe"
						aria-expanded={isOverlayVisible}
						aria-controls={overlaySearchBarId}
						aria-haspopup="dialog"
						onClick={() => setIsOverlayVisible(true)}
					>
						<SearchIcon />
					</SVGWrapperButton>
					{/* hidden search bar for small screens */}
					{isOverlayVisible && (
						<div
							id={overlaySearchBarId}
							className="overlay-search-bar__wrapper"
							aria-modal="true"
							role="search"
						>
							<SVGWrapperButton
								size="medium"
								onClick={() => setIsOverlayVisible(false)}
							>
								<ArrowBackIcon />
							</SVGWrapperButton>
							<SearchBar autoFocus />
						</div>
					)}
				</section>
				<div>
					<ThemeSwitcher />
					<section>
						<UserRelatedSection authData={authData} />
					</section>
				</div>
			</div>
		</nav>
	);
}
