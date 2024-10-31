import type { Recipe } from '../../types/recipes.js';
import { LocalDB } from '../../helpers/LowDB.js';
import recipesData from './recipes-db.json' with { type: 'json' };

const RecipesDB = await LocalDB.createDB<Recipe>({
	pathUrl: import.meta.url,
	relativePath: 'recipes-db',
	initialData: recipesData,
});

export default RecipesDB;
