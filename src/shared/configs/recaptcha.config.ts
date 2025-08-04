import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';
import { isDev } from '../utils';

export const getRecaptchaConfig = async (
	configService: ConfigService,
): Promise<GoogleRecaptchaModuleOptions> =>
	Promise.resolve({
		secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
		response: (req: Request & { headers: { recaptcha: string } }) => {
			const { recaptcha } = req.headers;

			return recaptcha ?? '';
		},
		skipIf: isDev(configService),
	} satisfies GoogleRecaptchaModuleOptions);
