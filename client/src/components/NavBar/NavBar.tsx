import './NavBar.css';

import type { AuthData } from '@monorepo/shared';

import {
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	useTransition,
} from 'react';
import useThemeStore from '@stores/theme.ts';

import { BarsIcon } from '@common/components/Icons.tsx';
import { RecipeBookLink } from '@common/components/RecipeBookLink.tsx';
import { SearchBar, type SearchBarHandle } from './SearchBar.tsx';
import { SVGWrapperButton } from '@common/components/SVGWrapperButton.tsx';
import { SearchIcon, ArrowBackIcon } from '@common/components/Icons.tsx';
import { ThemeSwitcher } from '@common/components/ThemeSwitcher.tsx';
import { UserRelatedSection } from './UserRelatedSection.tsx';

interface NavBarProps {
	authData: AuthData | null;
}

export function NavBar({ authData }: NavBarProps) {
	// only applies for small screens
	const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
	const [isPending, startTransition] = useTransition();

	const theme = useThemeStore(({ theme }) => theme);

	const inputSearchRef = useRef<SearchBarHandle>(null);
	const searchBarWrapperRef = useRef<HTMLDivElement>(null);

	const searchBarWrapperId = useId();

	const openSearchBar = useCallback(() => {
		startTransition(() => {
			setIsSearchBarVisible(true);
		});
	}, []);

	const handleClickOutside = useCallback((e: MouseEvent) => {
		if (
			searchBarWrapperRef.current &&
			!searchBarWrapperRef.current.contains(e.target as Node)
		) {
			setIsSearchBarVisible(false);
		}
	}, []);

	useEffect(() => {
		if (isPending || !isSearchBarVisible) return;

		inputSearchRef.current?.focus();

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [isPending, isSearchBarVisible, handleClickOutside]);

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
					<div
						id={searchBarWrapperId}
						ref={searchBarWrapperRef}
						aria-modal="true"
						aria-label="Recipes search bar container"
						className={`search-bar__wrapper ${isSearchBarVisible ? '' : 'hidden'}`}
						role="search"
					>
						<SVGWrapperButton
							size="medium"
							aria-label="Close search bar"
							aria-controls={searchBarWrapperId}
							onClick={() => setIsSearchBarVisible(false)}
						>
							<ArrowBackIcon />
						</SVGWrapperButton>
						<SearchBar ref={inputSearchRef} />
					</div>
					<SVGWrapperButton
						title="Search"
						size="medium"
						aria-label="Open search bar"
						aria-controls={searchBarWrapperId}
						aria-haspopup="dialog"
						onClick={openSearchBar}
					>
						<SearchIcon />
					</SVGWrapperButton>
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
