import { TypeProviderOptions } from '@/provider/provider.constants';
import { GitHubProvider } from '@/provider/services/github.provider';
import { GoogleProvider } from '@/provider/services/google.provider';
import { ConfigService } from '@nestjs/config';

export const getProvidersConfig = async (
	configService: ConfigService,
): Promise<TypeProviderOptions> =>
	Promise.resolve({
		base_url: configService.getOrThrow<string>('APPLICATION_URI'),
		services: [
			new GoogleProvider({
				client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
				client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
				scopes: ['profile', 'email'],
			}),
			new GitHubProvider({
				client_id: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
				client_secret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
				scopes: ['read:user', 'user:email'],
			}),
		],
	});
