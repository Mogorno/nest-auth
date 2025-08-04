import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/__generated__';
import type { Request } from 'express';

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request>();

		const user = request.user;

		if (!user) {
			throw new Error(
				`Can't get user from request. Authorization decorator must be used on protected route.`,
			);
		}

		return data ? user[data] : user;
	},
);
