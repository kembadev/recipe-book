export enum ERROR_CODES {
	INVALID_PARAMS = 'INVALID_PARAMS',
	NOT_FOUND = 'NOT_FOUND',
	BAD_REQUEST = 'BAD_REQUEST',
	INTERNAL_ERROR = 'INTERNAL_ERROR',
	INVALID_METHOD = 'INVALID_METHOD',
	INVALID_ORIGIN = 'INVALID_ORIGIN',
	UNAUTHORIZED = 'UNAUTHORIZED',
	OTHERS = 'OTHERS',
}

type ResponseData<S extends boolean, D> = S extends true ? D : null;
type ErrorCode<S extends boolean> = S extends true ? null : ERROR_CODES;
type Details<S extends boolean> = S extends true ? null : unknown;

interface Response<Success extends boolean, Data> {
	success: Success;
	data: ResponseData<Success, Data>;
	message: string;
	errorCode: ErrorCode<Success>;
	details: Details<Success>;
}

export class ResponseSchema<S extends boolean, D> {
	success: S;
	data: ResponseData<S, D>;
	message: string;
	errorCode: ErrorCode<S>;
	details: Details<S>;

	constructor({ success, data, message, errorCode, details }: Response<S, D>) {
		this.success = success;
		this.data = data;
		this.message = message;
		this.errorCode = errorCode;
		this.details = details;
	}

	static success<T>({ data, message }: { data: T; message?: string }) {
		return new ResponseSchema<true, T>({
			success: true,
			data,
			message: message ?? 'Request successful',
			errorCode: null,
			details: null,
		});
	}

	static failed({
		message,
		details = null,
		errorCode,
	}: {
		message: string;
		details?: unknown;
		errorCode: ERROR_CODES;
	}) {
		return new ResponseSchema<false, null>({
			success: false,
			data: null,
			message,
			errorCode,
			details,
		});
	}
}
