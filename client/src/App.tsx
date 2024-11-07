import './App.css';

import { RouterProvider } from 'react-router-dom';
import router from './pages/router.ts';

export default function App() {
	return <RouterProvider router={router} />;
}
