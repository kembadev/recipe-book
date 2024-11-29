import normalize from 'normalize-strings';

/**
 * @param originalText - The text from which to make the regExp
 * @returns A function that normalizes the string passed and compares it
 against the regExp previously created from the originalText
 */
export function getTextComparator(originalText: string) {
	// originalText without special characters and normalized.
	// it only keeps letters and numbers
	const originalTextNormalized = normalize(originalText).replace(
		/[^\p{L}\p{N}]/gu,
		'',
	);

	// not a regexp but a string with regexp syntax. it matches
	// one or more ocurrences of each character, even when after
	// this character there are one or two more characters
	// between it and the next character match

	// e.g. for originalText === 'chicken',
	// '320 chiiiLPck ennn w' pass the test
	const semiRegExp = originalTextNormalized.replace(
		/./g,
		char => char + '+.{0,2}\\s*',
	);

	const reg = new RegExp(`(?=${semiRegExp})`, 'i');

	return (textToTest: string) => reg.test(normalize(textToTest));
}
