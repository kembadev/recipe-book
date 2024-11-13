import './SignUpLink.css';

import { useTheme } from '@common/hooks/useTheme.ts';

import { Link } from 'react-router-dom';

export function SignUpLink() {
	const { theme } = useTheme();

	return (
		<Link className={`nav-bar__signup--link ${theme}`} to="/signup">
			Sign up
		</Link>
	);
}
