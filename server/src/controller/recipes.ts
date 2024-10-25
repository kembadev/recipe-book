import type { Handler } from '../types/express.js';

export class RecipesController {
	static getAll: Handler = (_req, _res, next) => {
		next();
	};
}
