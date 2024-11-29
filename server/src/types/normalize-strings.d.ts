declare module 'normalize-strings' {
	declare function normalize(
		str: string,
		customCharmap?: Record<string, string>,
	): string;

	export default normalize;
}
