import { Link } from 'react-router-dom';

export function ErrorBoundary() {
	return (
		<div style={{ padding: '35px' }}>
			<h1>Oops! Something went wrong.</h1>
			<Link to="/">Go to Home.</Link>
		</div>
	);
}
