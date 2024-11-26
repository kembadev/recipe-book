import type { RequestHandler } from 'express';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

import { ImagesModule } from '../model/images-local.js';
import { UnauthorizedError } from '../error-handling/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fallbackImagePath = path.join(
	__dirname,
	'../../public/image-fallback.webp',
);

const fallbackProfileImagePath = path.join(
	__dirname,
	'../../public/profile.webp',
);

export class ImagesController {
	static getAvatarByFilename: RequestHandler = (req, res) => {
		const filename = req.params.filename;
		const filePath = path.join(
			__dirname,
			`../db/uploads/avatars-images/${filename}`,
		);

		if (fs.existsSync(filePath)) return res.sendFile(filePath);

		res.status(404).sendFile(fallbackProfileImagePath);
	};

	static getRecipeByFilename: RequestHandler = async (req, res) => {
		const filename = req.params.filename;
		const filePath = path.join(
			__dirname,
			`../db/uploads/recipes-images/${filename}`,
		);

		if (!fs.existsSync(filePath)) {
			res.status(404).sendFile(fallbackImagePath);

			return;
		}

		const user = req.session;
		const userId = user && !(user instanceof Error) ? user.id : undefined;

		const result = await ImagesModule.mayUserViewRecipe({
			filename,
			userId,
		});

		if (!result) {
			res.status(404).sendFile(fallbackImagePath);

			return;
		}

		const { success, error } = result;

		if (success) return res.sendFile(filePath);

		if (error instanceof UnauthorizedError) {
			res.status(401).sendFile(fallbackImagePath);

			return;
		}

		res.status(500).sendFile(fallbackImagePath);
	};
}
