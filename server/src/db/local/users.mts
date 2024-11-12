import type { User } from '@monorepo/shared';
import { LocalDB } from '../../helpers/LocalDB.js';
import usersData from './users-db.json' with { type: 'json' };

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UsersDB = await LocalDB.createDB<User>({
	pathUrl: path.join(__dirname, './users-db'),
	initialData: usersData,
});

export default UsersDB;
