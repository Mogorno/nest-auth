import { UnauthorizedException } from '@nestjs/common';
import { BaseOAuthService } from './base-oauth.service';
import { TypeProviderOptions, TypeUserInfo } from './types';

export class GitHubProvider extends BaseOAuthService {
	constructor(options: TypeProviderOptions) {
		super({
			name: 'github',
			authorize_url: 'https://github.com/login/oauth/authorize',
			access_url: 'https://github.com/login/oauth/access_token',
			profile_url: 'https://api.github.com/user',
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret,
		});
	}

	protected async extractUserInfo(
		data: GitHubUserProfile,
	): Promise<TypeUserInfo> {
		const email = await this.fetchPrimaryEmail(data.access_token);
		if (!email) throw new UnauthorizedException('Email not verified');

		const userInfo: Omit<TypeUserInfo, 'provider'> = {
			id: data.id.toString(),
			email: email ?? data.email,
			displayName: data.name ?? data.login,
			picture: data.avatar_url,
		};
		return super.extractUserInfo(userInfo);
	}

	private async fetchPrimaryEmail(
		access_token: string,
	): Promise<string | null> {
		const response = await fetch('https://api.github.com/user/emails', {
			headers: {
				Authorization: `Bearer ${access_token}`,
				Accept: 'application/vnd.github.v3+json',
			},
		});

		if (!response.ok) return null;

		const emails = (await response.json()) as GitHubEmail[];

		const primaryEmail = emails.find(
			(email) => email.primary && email.verified,
		);
		return primaryEmail?.email ?? null;
	}
}

interface GitHubUserProfile {
	id: number;
	login: string;
	name: string;
	email: string;
	avatar_url: string;
	access_token: string;
}

interface GitHubEmail {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: 'public' | 'private' | null;
}
