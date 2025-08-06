import { PrismaService } from '@/prisma/prisma.service';
import { timeToMs } from '@/shared/utils';
import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { TokenType, User } from '@prisma/__generated__';
import type { Request } from 'express';
import { ConfirmationDto } from './dto';
import { MailService } from '@/shared/libs';
import { UserService } from '@/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class EmailConfirmationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
	) {}

	public async newVerification(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token: dto.token,
				type: TokenType.VERIFICATION,
			},
		});

		if (!existingToken) {
			throw new NotFoundException(`Token not found. Please try again`);
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException(`Token has expired. Please try again`);
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email,
		);

		if (!existingUser) {
			throw new NotFoundException(
				`User with email: ${existingToken.email} not found`,
			);
		}

		await this.prismaService.user.update({
			where: {
				id: existingUser.id,
			},
			data: {
				isVerified: true,
			},
		});

		await this.prismaService.token.delete({
			where: { id: existingToken.id },
		});

		return this.authService.saveSession(req, existingUser);
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await this.generateVerificationToken(user.email);

		await this.mailService.sendConfirmationMail(
			verificationToken.email,
			verificationToken.token,
		);

		return true;
	}

	private async generateVerificationToken(email: string) {
		const token = crypto.randomUUID();
		const expiresIn = new Date(new Date().getTime() + timeToMs('1h'));

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.VERIFICATION,
			},
		});

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
				},
			});
		}

		const verificationToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.VERIFICATION,
			},
		});

		return verificationToken;
	}
}
