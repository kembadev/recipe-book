import { Link } from 'react-router-dom';

export function RecipeBookLink() {
	return (
		<Link
			to="/"
			title="Home page"
			style={{
				minWidth: '115px',
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<img
				aria-hidden="true"
				src="/logo.svg"
				alt="logo_image"
				style={{ pointerEvents: 'none', userSelect: 'none', width: '100%' }}
			/>
		</Link>
	);
}
