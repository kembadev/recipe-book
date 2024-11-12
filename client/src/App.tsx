import './App.css';

import { useTheme } from '@common/hooks/useTheme.ts';
import { RouterProvider } from 'react-router-dom';
import router from './pages/router.tsx';

export default function App() {
	const { theme } = useTheme();

	return (
		<div className={`app ${theme}`}>
			<RouterProvider router={router} />
		</div>
	);
}
