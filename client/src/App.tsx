import './App.css';

import { RouterProvider } from 'react-router-dom';
import router from './pages/router.tsx';

export default function App() {
	return <RouterProvider router={router} />;
}
