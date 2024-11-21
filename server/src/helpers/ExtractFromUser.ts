import type { User, PrivateUser, PublicUser } from '@monorepo/shared';

type BasePrivateUserData = Omit<PrivateUser, 'avatar_src'>;

type BasePublicUserData = Omit<PublicUser, 'avatar_src'>;

export class ExtractFromUser {
	static basePrivateData(userData: User): BasePrivateUserData {
		const { name, createdAt, createdRecipes, savedRecipes } = userData;

		return { name, createdAt, createdRecipes, savedRecipes };
	}

	static basePublicData(userData: User): BasePublicUserData {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { savedRecipes, ...rest } = this.basePrivateData(userData);

		return rest;
	}
}
