import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { isDev } from '../utils';

export const getMailerConfig = async (
	configService: ConfigService,
): Promise<MailerOptions> =>
	Promise.resolve({
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<number>('MAIL_PORT'),
			secure: !isDev(configService),
			auth: {
				user: configService.getOrThrow<string>('MAIL_USER'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
			},
		},
		defaults: {
			from: configService.getOrThrow<string>('MAIL_FROM'),
		},
	} satisfies MailerOptions);
