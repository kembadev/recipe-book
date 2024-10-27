import { Link } from 'react-router-dom';

export function Home() {
	return (
		<header>
			<h1>Home</h1>
			<Link to="/profile">Go to Profile</Link>
		</header>
	);
}
