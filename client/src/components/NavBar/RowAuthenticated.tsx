import './RowAuthenticated.css';

import type { AuthData } from '@monorepo/shared';

import { useId, useState } from 'react';
import useThemeStore from '@stores/theme.ts';

import { SVGWrapperButton } from '@common/components/SVGWrapperButton.tsx';
import {
	PlusIcon,
	BookmarkIcon,
	UserProfileIcon,
	SignOutIcon,
} from '@common/components/Icons.tsx';
import { Link, NavLink } from 'react-router-dom';

interface UserProps {
	authData: AuthData;
}

export function RowAuthenticated({ authData }: UserProps) {
	const theme = useThemeStore(({ theme }) => theme);

	const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

	const userMenuId = useId();

	return (
		<div className={`nav-bar__user ${theme}`}>
			<NavLink title="Create new recipe" to="/new-recipe">
				<SVGWrapperButton size="small" aria-label="Create new recipe">
					<PlusIcon />
				</SVGWrapperButton>
			</NavLink>
			<NavLink title="Saved recipes" to="/saved-recipes">
				<SVGWrapperButton size="small" aria-label="Saved recipes">
					<BookmarkIcon />
				</SVGWrapperButton>
			</NavLink>
			<div className="profile-wrapper">
				<button
					title="Your profile"
					aria-label="Toggle global user menu"
					aria-expanded={isProfileMenuVisible}
					aria-controls={userMenuId}
					aria-haspopup="true"
					onClick={() => setIsProfileMenuVisible(!isProfileMenuVisible)}
				>
					<img src={authData.avatar_src ?? '/profile-picture-template.webp'} />
				</button>
				{isProfileMenuVisible && (
					<section
						id={userMenuId}
						className="profile-wrapper__user-menu"
						aria-modal="true"
						role="menu"
					>
						<div>
							<strong aria-label="User's name">{authData.name}</strong>
						</div>
						<div>
							<ul>
								<li>
									<Link to={`/profile/${authData.name}`}>
										<UserProfileIcon />
										<span>Your profile</span>
									</Link>
								</li>
								<li>
									<Link to="/logout">
										<SignOutIcon />
										<span>Sign out</span>
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<ul>
								<li>
									<NavLink to="/new-recipe">
										<PlusIcon />
										<span>Create new recipe</span>
									</NavLink>
								</li>
								<li>
									<NavLink to="/saved-recipes">
										<BookmarkIcon />
										<span>Saved recipes</span>
									</NavLink>
								</li>
							</ul>
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
