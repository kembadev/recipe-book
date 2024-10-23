export type User = {
	name: string;
	password: string;
	createdAt: string;
};

export type ProvidedUserInfo = Omit<User, 'createdAt'>;
type PublicUser = Pick<User, 'name' | 'createdAt'>;

export type UserResult =
	| Error
	| { success: true; value: PublicUser }
	| {
			success: false;
			paramsError: Partial<Record<keyof ProvidedUserInfo, string>>;
	  };
