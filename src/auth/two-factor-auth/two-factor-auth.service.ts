import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/shared/libs';
import { timeToMs } from '@/shared/utils';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { TokenType } from '@prisma/__generated__';

@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
	) {}

	public async validateTwoFactorToken(
		email: string,
		token: string,
	): Promise<true> {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR_AUTH,
			},
		});

		if (!existingToken) {
			throw new NotFoundException(
				`Token for two factor auth don't found. Please check token correctly. Or request a new one`,
			);
		}

		if (existingToken.token !== token) {
			throw new BadRequestException(
				`Token don't found. Please make sure you requested a token for this email address: ${email}`,
			);
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException(
				`Token has expired. Please request a new one`,
			);
		}

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.TWO_FACTOR_AUTH },
		});

		return true;
	}

	public async sendTwoFactorAuthToken(email: string) {
		const twoFactorAuthToken = await this.generateTwoFactorAuthToken(email);

		await this.mailService.sendConfirmationMail(
			twoFactorAuthToken.email,
			twoFactorAuthToken.token,
		);

		return true;
	}

	private async generateTwoFactorAuthToken(email: string) {
		const token = Math.floor(
			Math.random() * (999999 - 100000) + 100000,
		).toString();

		const expiresIn = new Date(new Date().getTime() + timeToMs('15m'));

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR_AUTH,
			},
		});

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR_AUTH,
				},
			});
		}

		const twoFactorAuthToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR_AUTH,
			},
		});

		return twoFactorAuthToken;
	}
}
