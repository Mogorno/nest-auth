import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import type { Request, Response } from 'express';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthProvider } from './decorators';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from '@/provider/provider.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
		private readonly configService: ConfigService,
	) {}

	@Recaptcha()
	@Post('register')
	@HttpCode(HttpStatus.OK)
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto);
	}

	@Recaptcha()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto);
	}

	@Get('oauth/callback/:provider')
	@AuthProvider()
	public async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Param('provider') provider: string,
		@Query('code') code: string,
	) {
		if (!code) {
			throw new BadRequestException('Auth code not found');
		}

		await this.authService.extractProfileFromCode(req, provider, code);

		return res.redirect(
			`${this.configService.getOrThrow<string>('DEFAULT_LOGIN_REDIRECT')}/dashboard/settings`,
		);
	}

	@Get('/oauth/connect/:provider')
	@HttpCode(HttpStatus.OK)
	@AuthProvider()
	public async connect(@Param('provider') provider: string) {
		const providerInstance = this.providerService.findByService(provider);
		return Promise.resolve({
			url: providerInstance?.getAuthUrl(),
		});
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.logout(req, res);
	}

	@Get()
	public async getMe() {
		return Promise.resolve('Hello world');
	}
}
