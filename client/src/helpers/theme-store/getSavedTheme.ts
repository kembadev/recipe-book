export type Theme = 'light' | 'dark';

export function getSavedTheme(): Theme {
	const savedSerializeTheme = localStorage.getItem('theme');

	let parsedTheme;

	try {
		if (savedSerializeTheme) {
			parsedTheme = JSON.parse(savedSerializeTheme);
		}
	} catch {
		/* empty */
	}

	let savedTheme;

	if (parsedTheme === 'dark' || parsedTheme === 'light') {
		savedTheme = parsedTheme;
	} else {
		const defaultTheme: Theme = matchMedia('(prefers-color-scheme: dark)')
			.matches
			? 'dark'
			: 'light';

		savedTheme = defaultTheme;
	}

	localStorage.setItem('theme', JSON.stringify(savedTheme));

	return savedTheme;
}
