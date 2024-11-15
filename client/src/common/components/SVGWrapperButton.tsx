import './SVGWrapperButton.css';

import type { ButtonHTMLAttributes } from 'react';

interface SVGWrapperButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: JSX.Element;
}

export function SVGWrapperButton({
	children,
	...props
}: SVGWrapperButtonProps) {
	return (
		<button {...props} className="svg-wrapper__rounded-btn">
			{children}
		</button>
	);
}
