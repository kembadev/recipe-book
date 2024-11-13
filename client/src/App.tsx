import { RouterProvider } from 'react-router-dom';
import ThemeProvider from '@context/ThemeProvider.tsx';
import router from './pages/router.tsx';

export default function App() {
	return (
		<ThemeProvider>
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}
