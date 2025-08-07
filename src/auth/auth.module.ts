import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '@/user/user.service';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getProvidersConfig, getRecaptchaConfig } from '@/shared/configs';
import { ProviderModule } from '@/provider/provider.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { MailService } from '@/shared/libs';
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Module({
	imports: [
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService],
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService],
		}),
		forwardRef(() => EmailConfirmationModule),
		PasswordRecoveryModule,
		TwoFactorAuthModule,
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, MailService, TwoFactorAuthService],
	exports: [AuthService],
})
export class AuthModule {}
