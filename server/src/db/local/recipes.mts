import type { Recipe } from '@monorepo/shared';
import { LocalDB } from '../../helpers/LocalDB.js';
import recipesData from './recipes-db.json' with { type: 'json' };

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RecipesDB = await LocalDB.createDB<Recipe>({
	pathUrl: path.join(__dirname, './recipes-db'),
	initialData: recipesData,
});

export default RecipesDB;
