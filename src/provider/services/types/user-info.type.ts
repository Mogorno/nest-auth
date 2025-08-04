export interface TypeUserInfo {
	id: string;
	email: string;
	displayName: string;
	picture?: string;
	access_token?: string;
	refresh_token?: string;
	expires_at?: string;
	provider: string;
}
