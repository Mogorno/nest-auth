import { BaseOAuthService } from './base-oauth.service';
import { TypeProviderOptions, TypeUserInfo } from './types';

export class GoogleProvider extends BaseOAuthService {
	constructor(options: TypeProviderOptions) {
		super({
			name: 'google',
			authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
			access_url: 'https://oauth2.googleapis.com/token',
			profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret,
		});
	}

	protected async extractUserInfo(data: GoogleProfile): Promise<TypeUserInfo> {
		const userInfo: Omit<TypeUserInfo, 'provider'> = {
			id: data.sub,
			email: data.email,
			displayName: data.name,
			picture: data.picture,
		};
		return super.extractUserInfo(userInfo);
	}
}

interface GoogleProfile {
	aud: string;
	azp: string;
	email: string;
	email_verified: boolean;
	exp: number;
	family_name?: string;
	given_name: string;
	hd?: string;
	iat: number;
	iss: string;
	jti?: string;
	locale?: string;
	name: string;
	nbf?: number;
	picture: string;
	sub: string;
	access_token: string;
	refresh_token?: string;
}
