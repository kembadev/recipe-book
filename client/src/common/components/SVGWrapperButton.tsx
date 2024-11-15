import './SVGWrapperButton.css';

import type { ButtonHTMLAttributes } from 'react';

interface SVGWrapperButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	size: 'small' | 'medium' | 'large';
	children: JSX.Element;
}

export function SVGWrapperButton({
	children,
	size,
	...props
}: SVGWrapperButtonProps) {
	return (
		<button
			{...props}
			className={`svg-wrapper__rounded-btn ${size} ${props.className ?? ''}`}
		>
			{children}
		</button>
	);
}
