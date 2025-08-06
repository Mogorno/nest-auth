import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { MailModule, MailService } from '@/shared/libs';
import { AuthModule } from '../auth.module';
import { UserService } from '@/user/user.service';

@Module({
	imports: [MailModule, forwardRef(() => AuthModule)],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService, UserService, MailService],
	exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
