import './SearchBar.css';

import useThemeStore from '@stores/theme.ts';

import { Form } from 'react-router-dom';
import { SearchIcon } from '@common/components/Icons.tsx';

interface SearchBarProps {
	autoFocus?: boolean;
}

export function SearchBar({ autoFocus = false }: SearchBarProps) {
	const theme = useThemeStore(({ theme }) => theme);

	return (
		<Form
			className={`nav-bar__recipes-search--form ${theme}`}
			method="get"
			action="/recipes"
		>
			<input
				name="search"
				placeholder="type recipe to search for"
				type="text"
				autoComplete="off"
				autoFocus={autoFocus}
			/>
			<button title="Search">
				<SearchIcon />
			</button>
		</Form>
	);
}
