import './ThemeSwitcher.css';

import useThemeStore from '@stores/theme.ts';
import { SunIcon, MoonIcon } from './Icons.tsx';

export function ThemeSwitcher() {
	const { theme, toggleTheme } = useThemeStore();

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
