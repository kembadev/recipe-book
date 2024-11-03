type SuccessfulResponse = true;
type FailedResponse = false;

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

type ResponseType = SuccessfulResponse | FailedResponse;

type Success<T extends ResponseType> = T extends SuccessfulResponse
	? true
	: false;

type Data<T extends ResponseType> = T extends SuccessfulResponse
	? unknown
	: null;

type ErrorCode<T extends ResponseType> = T extends SuccessfulResponse
	? null
	: ERROR_CODES;

type Details<T extends ResponseType> = T extends SuccessfulResponse
	? null
	: unknown;

interface Response<T extends ResponseType> {
	success: Success<T>;
	data: Data<T>;
	message: string;
	errorCode: ErrorCode<T>;
	details: Details<T>;
}

export class ResponseSchema<T extends ResponseType> implements Response<T> {
	success: Success<T>;
	data: Data<T>;
	message: string;
	errorCode: ErrorCode<T>;
	details: Details<T>;

	constructor({ success, data, message, errorCode, details }: Response<T>) {
		this.success = success;
		this.data = data;
		this.message = message;
		this.errorCode = errorCode;
		this.details = details;
	}

	static success({
		data,
		message = null,
	}: {
		data: unknown;
		message?: string | null;
	}) {
		return new ResponseSchema<SuccessfulResponse>({
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
		return new ResponseSchema<FailedResponse>({
			success: false,
			data: null,
			message,
			errorCode,
			details,
		});
	}
}
