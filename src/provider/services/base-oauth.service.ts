import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import {
	TypeBaseProviderOptions,
	TypeBaseTokenResponse,
	TypeUserInfo,
} from './types';

@Injectable()
export class BaseOAuthService {
	private BASE_URL: string;

	constructor(private readonly options: TypeBaseProviderOptions) {}

	protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
		return Promise.resolve({
			...(data as TypeUserInfo),
			provider: this.options.name,
		});
	}

	public getAuthUrl() {
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scopes ?? []).join(' '),
			access_type: 'offline',
			prompt: 'select_account',
		});

		return `${this.options.authorize_url}?${query}`;
	}

	public async findUserByCode(code: string): Promise<TypeUserInfo> {
		const client_id = this.options.client_id;
		const client_secret = this.options.client_secret;

		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			redirect_uri: this.getRedirectUrl(),
			grant_type: 'authorization_code',
			code,
		});

		const tokenRequest = await fetch(this.options.access_url, {
			method: 'POST',
			body: tokenQuery,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
		});

		const { access_token, refresh_token, expires_at, expires_in } =
			(await tokenRequest.json()) as TypeBaseTokenResponse;

		if (!tokenRequest.ok) {
			throw new BadRequestException(
				`Can't get user with ${this.options.profile_url}. Check access token.`,
			);
		}

		if (typeof access_token !== 'string') {
			throw new BadRequestException(
				`No tokens with ${this.options.access_url}. Check existing auth code.`,
			);
		}

		const userRequest = await fetch(this.options.profile_url, {
			headers: {
				Authorization: `Bearer ${access_token}`,
				Accept: 'application/json',
			},
		});

		if (!userRequest.ok) {
			throw new UnauthorizedException(
				`Can't get user with ${this.options.profile_url}. Check access token.`,
			);
		}

		const user = (await userRequest.json()) as TypeUserInfo;

		const userData = await this.extractUserInfo({ ...user, access_token });

		return {
			...userData,
			access_token: access_token,
			refresh_token: refresh_token,
			expires_at: expires_at || expires_in,
			provider: this.options.name,
		};
	}

	public getRedirectUrl() {
		return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
	}

	set base_url(value: string) {
		this.BASE_URL = value;
	}

	get name() {
		return this.options.name;
	}

	get access_url() {
		return this.options.access_url;
	}

	get profile_url() {
		return this.options.profile_url;
	}

	get scopes() {
		return this.options.scopes;
	}
}
