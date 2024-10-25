import type { User } from '../../types/users.js';
import { LocalDB } from '../../helpers/LowDB.js';
import usersData from './users-db.json' with { type: 'json' };

const UsersDB = await LocalDB.createDB<User>({
	pathUrl: import.meta.url,
	relativePath: 'users-db',
	initialData: usersData,
});

export default UsersDB;
