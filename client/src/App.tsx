import './App.css';

import ThemeProvider from '@context/ThemeProvider.tsx';
import { RouterProvider } from 'react-router-dom';
import router from './pages/router.ts';

export default function App() {
	return (
		<ThemeProvider>
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}
