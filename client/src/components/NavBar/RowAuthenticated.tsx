import './RowAuthenticated.css';

import type { PrivateUser } from '@monorepo/shared';

import { useId, useState } from 'react';
import useThemeStore from '@stores/theme.ts';

import { SVGWrapperButton } from '@common/components/SVGWrapperButton.tsx';
import {
	PlusIcon,
	BookmarkIcon,
	UserProfileIcon,
	SignOutIcon,
} from '@common/components/Icons.tsx';
import { Link } from 'react-router-dom';

interface UserProps {
	userData: PrivateUser;
}

export function RowAuthenticated({ userData }: UserProps) {
	const theme = useThemeStore(({ theme }) => theme);

	const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

	const userMenuId = useId();

	return (
		<div className={`nav-bar__user ${theme}`}>
			<Link title="Create new recipe" to="/new-recipe">
				<SVGWrapperButton size="small">
					<PlusIcon />
				</SVGWrapperButton>
			</Link>
			<Link title="Saved recipes" to="/saved-recipes">
				<SVGWrapperButton size="small">
					<BookmarkIcon />
				</SVGWrapperButton>
			</Link>
			<div className="profile-wrapper">
				<button
					title="Your profile"
					aria-label="Toggle global user menu"
					aria-expanded={isProfileMenuVisible}
					aria-controls={userMenuId}
					aria-haspopup="true"
					onClick={() => setIsProfileMenuVisible(!isProfileMenuVisible)}
				>
					<img src={userData.avatar_src ?? '/profile-picture-template.webp'} />
				</button>
				{isProfileMenuVisible && (
					<section
						id={userMenuId}
						className="profile-wrapper__user-menu"
						aria-modal="true"
						role="menu"
					>
						<div>
							<strong aria-label="User's name">{userData.name}</strong>
						</div>
						<div>
							<ul>
								<li>
									<Link to={`/profile/${userData.name}`}>
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
									<Link to="/new-recipe">
										<PlusIcon />
										<span>Create new recipe</span>
									</Link>
								</li>
								<li>
									<Link to="/saved-recipes">
										<BookmarkIcon />
										<span>
											Saved recipes {`(${userData.savedRecipes.length ?? 0})`}
										</span>
									</Link>
								</li>
							</ul>
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
