import { Link } from 'react-router-dom';

Component.displayName = 'DefaultNotFound';

export function Component() {
	return (
		<div style={{}}>
			<h1>404 - Page not found</h1>
			<Link to="/">Go to Home.</Link>
		</div>
	);
}
