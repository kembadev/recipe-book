import { SignUpForm } from '@components/SignUpForm/SignUpForm.tsx';

Component.displayName = 'SignUp';

export function Component() {
	return (
		<div
			style={{
				display: 'grid',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<SignUpForm />
		</div>
	);
}
