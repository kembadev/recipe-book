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

	static signUp({ name, password }: UserInfo) {
		return this.#postAsJSON({
			path: '/api/users/register',
			data: { name, password },
		});
	}

	static signIn({ name, password }: UserInfo) {
		return this.#postAsJSON({
			path: '/api/users/login',
			data: { name, password },
		});
	}

	static getAuthInfo() {
		return fetch('/api/users/auth');
	}

	static logOut() {
		return fetch('/api/users/logout', { method: 'POST' });
	}
}
