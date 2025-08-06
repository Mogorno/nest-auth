import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { ConfirmationTemplate } from './templates';
import * as React from 'react';
import { parseStrArray } from '@/shared/utils';

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
	) {}

	public sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html,
		});
	}

	public async sendConfirmationMail(
		email: string,
		token: string,
	): ReturnType<MailerService['sendMail']> {
		const domain = this.configService.getOrThrow<string>(
			parseStrArray('ALLOWED_ORIGINS')[0],
		);

		const html = await render(
			React.createElement(ConfirmationTemplate, { domain, token }),
		);

		return this.sendMail(email, 'Confirm your email', html);
	}
}
