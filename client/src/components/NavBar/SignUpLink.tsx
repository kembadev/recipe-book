import './SignUpLink.css';

import useThemeStore from '@stores/theme.ts';

import { Link } from 'react-router-dom';

export function SignUpLink() {
	const theme = useThemeStore(({ theme }) => theme);

	return (
		<Link className={`nav-bar__signup--link ${theme}`} to="/signup">
			Sign up
		</Link>
	);
}
