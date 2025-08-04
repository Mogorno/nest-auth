import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const userId = request.session.userId;

		if (typeof userId === 'undefined') {
			throw new UnauthorizedException(
				'User not authorized, please login for get access',
			);
		}

		const user = await this.userService.findById(userId);

		request.user = user;

		return true;
	}
}
