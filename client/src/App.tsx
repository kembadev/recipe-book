import './App.css';

import { useTheme } from '@common/hooks/useTheme.ts';
import { RouterProvider } from 'react-router-dom';
import router from './pages/router.ts';

export default function App() {
	const { theme } = useTheme();

	return (
		<div className={`app ${theme}`}>
			<RouterProvider router={router} />
		</div>
	);
}
