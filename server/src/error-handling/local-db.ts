export class LocalDBError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'LocalDBError';
	}
}
