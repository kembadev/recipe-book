/**
 * @returns A filename without any extension
 */
export function generateUniqueFilename() {
	const randomInt = Math.round(Math.random() * 1e6);

	return Date.now() + '_' + randomInt;
}
