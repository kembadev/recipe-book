import './SearchBar.css';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import useThemeStore from '@stores/theme.ts';

import { Form } from 'react-router-dom';
import { SearchIcon } from '@common/components/Icons.tsx';

export interface SearchBarHandle {
	focus: () => void;
}

export const SearchBar = forwardRef<SearchBarHandle>((_, ref) => {
	const theme = useThemeStore(({ theme }) => theme);

	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref, () => ({
		focus: () => inputRef.current?.focus(),
	}));

	return (
		<Form
			className={`nav-bar__recipes-search--form ${theme}`}
			method="get"
			action="/recipes"
		>
			<input
				ref={inputRef}
				name="search"
				placeholder="type recipe to search for"
				type="text"
				autoComplete="off"
			/>
			<button title="Search">
				<SearchIcon />
			</button>
		</Form>
	);
});
