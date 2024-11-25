import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UsersAPI } from '@services/api/users.ts';

Component.displayName = 'LogOut';

export function Component() {
	const navigate = useNavigate();

	useEffect(() => {
		UsersAPI.logOut().then(() => navigate('/', { replace: true }));
	}, [navigate]);

	return <small>signing out...</small>;
}
