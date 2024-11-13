import './SearchBar.css';

import { Form } from 'react-router-dom';
import { SearchIcon } from '@common/components/Icons.tsx';

export function SearchBar() {
	return (
		<Form
			className="nav-bar__recipes-search--form"
			method="get"
			action="/recipes"
		>
			<input
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
}
