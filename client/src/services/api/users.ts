interface UserInfo {
	name: unknown;
	password: unknown;
}

export class UsersAPI {
	static #postAsJSON({
		path,
		data,
	}: {
		path: string;
		data: Record<string, unknown>;
	}) {
		return fetch(path, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	}

	static async signUp({ name, password }: UserInfo) {
		return await this.#postAsJSON({
			path: '/api/users/register',
			data: { name, password },
		});
	}

	static async signIn({ name, password }: UserInfo) {
		return await this.#postAsJSON({
			path: '/api/users/login',
			data: { name, password },
		});
	}
}
