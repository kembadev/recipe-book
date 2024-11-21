import { PORT } from './config.js';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

import express from 'express';

import { ResponseSchema, ERROR_CODES } from '@monorepo/shared';
import { apiRouter } from './routes/index.js';

import { ImagesController } from './controller/images.js';

import { bodyParsingErrorMiddleware } from './middlewares/bodyParsingError.js';
import cookieParser from 'cookie-parser';
import { sessionMiddleware } from './middlewares/session.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');

app.use(express.json(), bodyParsingErrorMiddleware('Invalid JSON.'));

app.use(cookieParser(), sessionMiddleware);

// most important server endpoints
app.use('/api', apiRouter);

app.get('/robots.txt', (_req, res) => {
	res.sendFile(path.join(__dirname, '../robots.txt'));
});

app.get('/images/avatars/:filename', ImagesController.getAvatarByFilename);
app.get('/images/recipes/:filename', ImagesController.getRecipeByFilename);

// views
app.use(express.static(path.join(__dirname, 'view')));
app.get('*', (_req, res) => {
	res.sendFile(path.join(__dirname, 'view/index.html'));
});

// general resource not found controller (non-get requests)
app.use((_req, res) => {
	res.status(404).json(
		ResponseSchema.failed({
			message: 'Resource not found.',
			errorCode: ERROR_CODES.NOT_FOUND,
		}),
	);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
