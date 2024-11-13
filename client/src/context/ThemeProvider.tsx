import { ReactNode, useState } from 'react';

import { ThemeContext, type Theme } from './ThemeContext.ts';

const locallySavedTheme = localStorage.getItem('theme');

let savedTheme;

try {
	if (locallySavedTheme) {
		savedTheme = JSON.parse(locallySavedTheme);
	}
} catch {
	/* empty */
}

let selectedTheme: Theme;

if (savedTheme === 'dark' || savedTheme === 'light') {
	selectedTheme = savedTheme;
} else {
	const defaultTheme: Theme = matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';

	selectedTheme = defaultTheme;
}

localStorage.setItem('theme', JSON.stringify(selectedTheme));

export default function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState(selectedTheme);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
