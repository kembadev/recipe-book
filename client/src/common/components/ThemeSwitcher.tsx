import './ThemeSwitcher.css';

import useThemeStore from '@stores/theme.ts';

import { SVGWrapperButton } from './SVGWrapperButton.tsx';
import { SunIcon, MoonIcon } from './Icons.tsx';

export function ThemeSwitcher() {
	const { theme, toggleTheme } = useThemeStore();

	return (
		<SVGWrapperButton
			title="Toggle theme"
			onClick={toggleTheme}
			size="small"
			aria-label="Toggle between dark and light themes"
			aria-live="polite"
			className={`toggle-theme-btn ${theme}`}
		>
			{theme === 'dark' ? <MoonIcon /> : <SunIcon />}
		</SVGWrapperButton>
	);
}
