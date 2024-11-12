import './TogglableTheme.css';

import { useTheme } from '@common/hooks/useTheme.ts';
import { SunIcon, MoonIcon } from './Icons.tsx';

export function TogglableTheme() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			className={`toggle-theme-btn ${theme}`}
			title="Toggle theme"
			onClick={toggleTheme}
		>
			{theme === 'dark' ? <MoonIcon /> : <SunIcon />}
		</button>
	);
}
