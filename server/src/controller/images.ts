import type { RequestHandler } from 'express';

export class ImagesController {
	// db/uploads/avatars/filename
	static getAvatarByFilename: RequestHandler = (req, res) => {
		const filename = req.params.filename;

		res.send(filename);
	};

	// db/uploads/recipes-images/filename
	static getRecipeByFilename: RequestHandler = (req, res) => {
		const filename = req.params.filename;

		res.send(filename);
	};
}
