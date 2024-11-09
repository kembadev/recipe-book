import { useCallback, useContext } from 'react';
import { ThemeContext } from '@context/ThemeContext';

export function useTheme() {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider.');
	}

	const { theme, setTheme } = context;

	const toggleTheme = useCallback(() => {
		if (theme === 'dark') {
			setTheme('light');
			localStorage.setItem('theme', '"light"');
			return;
		}

		setTheme('dark');
		localStorage.setItem('theme', '"dark"');
	}, [theme, setTheme]);

	return { theme, toggleTheme };
}
