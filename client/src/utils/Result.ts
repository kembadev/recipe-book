type ResultError = Error | null;
type ResultSuccess<E extends ResultError> = E extends null ? true : false;

export class Result<T, E extends ResultError> {
	success: ResultSuccess<E>;
	error: E;
	value: T;

	constructor(success: ResultSuccess<E>, error: E, value: T) {
		this.success = success;
		this.error = error;
		this.value = value;
	}

	static success = <Q>(value: Q) => {
		return new Result(true, null, value);
	};

	static failed = (error: Error) => {
		return new Result(false, error, null);
	};
}
