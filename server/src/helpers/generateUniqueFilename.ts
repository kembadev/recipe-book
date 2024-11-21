import path from 'node:path';

export function generateUniqueFilename(originalName: string) {
	const extension = path.extname(originalName);

	if (extension === '' || extension === '.') return null;

	const randomInt = Math.round(Math.random() * 1e6);
	const filename = Date.now() + '_' + randomInt + '.' + extension;

	return filename;
}
