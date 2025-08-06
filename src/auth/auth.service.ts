import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '@/user/user.service';
import { AuthMethod, User } from '@prisma/__generated__';
import type { Request, Response } from 'express';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from '@/provider/provider.service';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService,
		private readonly emailConfirmationService: EmailConfirmationService,
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const { email, password, displayName } = dto;

		const existingUser = await this.userService.findByEmail(email);

		if (existingUser) {
			throw new ConflictException(
				`User with email: ${dto.email} already exist. Please try another email`,
			);
		}

		const newUser = await this.userService.create({
			email,
			password,
			displayName,
			method: AuthMethod.CREDENTIALS,
			isVerified: false,
		});

		await this.emailConfirmationService.sendVerificationToken(newUser);

		return {
			message: `You have successfully registered. Confirmation email has been sent to ${email}. Please check your email.`,
		};
	}

	public async login(req: Request, dto: LoginDto) {
		const { email, password } = dto;
		const user = await this.userService.findByEmail(email);

		if (!user || !user.password) {
			throw new NotFoundException(
				`User with email: ${email} not found. Please try again`,
			);
		}

		const isPasswordMatch = await verify(user.password, password);

		if (!isPasswordMatch) {
			throw new UnauthorizedException(`Password not match. Please try again`);
		}

		if (!user.isVerified) {
			await this.emailConfirmationService.sendVerificationToken(user);

			throw new UnauthorizedException(
				`Please confirm your email to login. Please check your email.`,
			);
		}

		return this.saveSession(req, user);
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string,
	) {
		const providerInstance = this.providerService.findByService(provider);

		const profile = await providerInstance?.findUserByCode(code);

		if (!profile) {
			throw new UnauthorizedException(
				`Can't get user with ${provider}. Check access token.`,
			);
		}

		const accounts = await this.prismaService.account.findFirst({
			where: {
				providerAccountId: profile.id,
				provider: profile.provider,
			},
		});

		let user = accounts?.userId
			? await this.userService.findById(accounts.userId)
			: null;

		if (user) {
			return this.saveSession(req, user);
		}

		user = await this.userService.create({
			email: profile.email,
			password: '',
			displayName: profile.displayName,
			method: AuthMethod[profile.provider.toUpperCase() as 'GITHUB' | 'GOOGLE'],
			isVerified: true,
		});

		if (!accounts) {
			await this.prismaService.account.create({
				data: {
					userId: user.id,
					type: 'oauth',
					providerAccountId: profile.id,
					provider: profile.provider,
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: +(profile.expires_at ?? ''),
				},
			});
		}

		return this.saveSession(req, user);
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy((err) => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							`Can't destroy session. Check session config or session will be lost`,
						),
					);
				}
				res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

				resolve();
			});
		});
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id;

			req.session.save((err) => {
				if (err) {
					console.log(err);
					return reject(
						new InternalServerErrorException(
							`Can't save session. Check session config`,
						),
					);
				}

				resolve({ user });
			});
		});
	}
}
