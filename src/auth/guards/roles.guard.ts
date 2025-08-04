import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { UserRole } from '@prisma/__generated__';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		const request = context.switchToHttp().getRequest<Request>();

		if (!roles) {
			return true;
		}

		const user = request.user;

		if (user && roles.includes(user.role)) {
			return true;
		}

		throw new ForbiddenException('You have no access to this resource');
	}
}
