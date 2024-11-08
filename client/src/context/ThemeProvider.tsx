import { ReactNode, useState } from 'react';

import { ThemeContext, type Theme } from './ThemeContext.ts';

const locallySavedTheme = localStorage.getItem('theme');
const savedTheme = locallySavedTheme ? JSON.parse(locallySavedTheme) : null;

const defaultTheme: Theme = matchMedia('(prefers-color-scheme: dark)').matches
	? 'dark'
	: 'light';

let themeSelected: Theme;

if (savedTheme === 'dark' || savedTheme === 'light') {
	themeSelected = savedTheme;
} else {
	themeSelected = defaultTheme;
}

localStorage.setItem('theme', themeSelected);

export default function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState(themeSelected);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
