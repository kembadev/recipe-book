import { create } from 'zustand';
import {
	type Theme,
	getSavedTheme,
} from '@helpers/theme-store/getSavedTheme.ts';

interface ThemeState {
	theme: Theme;
	toggleTheme: () => void;
}

const savedTheme = getSavedTheme();

const useThemeStore = create<ThemeState>(set => ({
	theme: savedTheme,
	toggleTheme: () =>
		set(({ theme }) => {
			const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';

			localStorage.setItem('theme', JSON.stringify(newTheme));

			return { theme: newTheme };
		}),
}));

export default useThemeStore;
