import { render } from '@testing-library/react';
import ThemeProvider from '@context/ThemeProvider.tsx';
import { ReactNode } from 'react';

export function renderWithThemeProvider(ui: ReactNode) {
	return render(<ThemeProvider>{ui}</ThemeProvider>);
}
