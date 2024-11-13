import { SignUpLink } from './SignUpLink.tsx';
import { SignInLink } from './SignInLink.tsx';

export function Otherwise() {
	return (
		<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
			<SignInLink />
			<SignUpLink />
		</div>
	);
}
