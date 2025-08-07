import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { MailService } from '@/shared/libs';

@Module({
	providers: [TwoFactorAuthService, MailService],
})
export class TwoFactorAuthModule {}
