import type { User } from '../../types/users.js';
import { LocalDB } from '../../helpers/LowDB.js';

const UsersDB = await LocalDB.createDB<User>({
	pathUrl: import.meta.url,
	relativePath: 'users-db',
});

export default UsersDB;
