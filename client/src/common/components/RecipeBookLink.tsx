import LogoWithText from './LogoWithText.tsx';
import { Link } from 'react-router-dom';

export function RecipeBookLink() {
	return (
		<Link
			to="/"
			title="Home page"
			style={{
				color: '#fd427b',
				minWidth: '115px',
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<LogoWithText />
		</Link>
	);
}
