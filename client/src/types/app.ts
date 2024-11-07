type LowerCaseFormMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type HTMLFormMethod =
	| LowerCaseFormMethod
	| Uppercase<LowerCaseFormMethod>;
