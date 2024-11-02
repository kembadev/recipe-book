import { rm } from 'node:fs';

export function getRemoveFile(fileUrl: string) {
	return () => {
		return new Promise<Error | null>(resolve => {
			rm(fileUrl, resolve);
		});
	};
}
