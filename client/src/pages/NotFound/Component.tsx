import './styles.css';

import { Link } from 'react-router-dom';

Component.displayName = 'DefaultNotFound';

export function Component() {
	return (
		<div className="not-found__wrapper">
			<h1>404 - Page not found</h1>
			<h2>
				Not what you were looking for? <Link to="/">Go to home.</Link>
			</h2>
		</div>
	);
}
