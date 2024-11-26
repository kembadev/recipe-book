import type { ResponseSchema } from '@monorepo/shared';
import type { AuthData } from '@src/types/auth.ts';

import { IS_DEVELOPMENT } from '@config';

import { makeLoader } from 'react-router-typesafe';
import { UsersAPI } from '@services/api/users';
import { Result } from '@monorepo/shared';

export const getUserAuthLoader = makeLoader(async () => {
	const res = await UsersAPI.getAuthInfo();

	if (!res.ok) return Result.failed(new Error('Not authenticated.'));

	let data;

	try {
		const { data: userData } = (await res.json()) as ResponseSchema<
			true,
			AuthData
		>;

		data = userData;
	} catch {
		if (IS_DEVELOPMENT) {
			return Result.failed(
				new Error('Served from vite. Received HTML instead of JSON data.'),
			);
		}

		return Result.failed(new Error('Could not parse received data.'));
	}

	return Result.success(data);
});
