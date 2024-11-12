import { Link, useParams } from 'react-router-dom';

Component.displayName = 'Profile';

export function Component() {
	const { username } = useParams();

	return (
		<header>
			<h1>{username ?? 'Profile'}</h1>
			<Link to="/">Go to Home</Link>
		</header>
	);
}
