type ResultSuccess<E> = E extends Error ? false : true;
type ResultError<E> = E extends Error ? E : null;
type Value<T, E> = E extends Error ? null : T;

export class Result<T, E> {
	success: ResultSuccess<E>;
	error: ResultError<E>;
	value: Value<T, E>;

	constructor(
		success: ResultSuccess<E>,
		error: ResultError<E>,
		value: Value<T, E>,
	) {
		this.success = success;
		this.error = error;
		this.value = value;
	}

	static success = <Q>(value: Q) => {
		return new Result(true, null, value);
	};

	static failed = <F extends Error>(error: F) => {
		return new Result(false as ResultSuccess<F>, error as ResultError<F>, null);
	};
}
