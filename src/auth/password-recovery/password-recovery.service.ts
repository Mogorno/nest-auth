import { PrismaService } from '@/prisma/prisma.service';
import { timeToMs } from '@/shared/utils';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { TokenType } from '@prisma/__generated__';
import { MailService } from '@/shared/libs';
import { UserService } from '@/user/user.service';
import { NewPasswordDto, ResetPasswordDto } from './dto';
import { hash } from 'argon2';

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
	) {}

	public async resetPassword(dto: ResetPasswordDto) {
		const { email } = dto;

		const existingUser = await this.userService.findByEmail(email);

		if (!existingUser) {
			throw new NotFoundException(`User with email: ${email} not found`);
		}

		const passwordResetToken = await this.generatePasswordResetToken(
			existingUser.email,
		);

		await this.mailService.sendResetPasswordMail(
			existingUser.email,
			passwordResetToken.token,
		);

		return true;
	}

	public async newPassword(dto: NewPasswordDto, token: string) {
		const { password } = dto;

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				token,
				type: TokenType.PASSWORD_RESET,
			},
		});

		if (!existingToken) {
			throw new NotFoundException(
				`Token don't found. Please check token correctly. Or request a new one`,
			);
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException(
				`Token has expired. Please request a new one`,
			);
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email,
		);

		if (!existingUser) {
			throw new NotFoundException(
				`User with email: ${existingToken.email} not found. Please check the correctness of the email entered.`,
			);
		}

		await this.prismaService.user.update({
			where: {
				id: existingUser.id,
			},
			data: {
				password: await hash(password),
			},
		});

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.PASSWORD_RESET },
		});

		return true;
	}

	public async sendPasswordResetToken(email: string) {
		const passwordResetToken = await this.generatePasswordResetToken(email);

		await this.mailService.sendConfirmationMail(
			passwordResetToken.email,
			passwordResetToken.token,
		);

		return true;
	}

	private async generatePasswordResetToken(email: string) {
		const token = crypto.randomUUID();
		const expiresIn = new Date(new Date().getTime() + timeToMs('1h'));

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.PASSWORD_RESET,
			},
		});

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
				},
			});
		}

		const passwordResetToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.PASSWORD_RESET,
			},
		});

		return passwordResetToken;
	}
}
