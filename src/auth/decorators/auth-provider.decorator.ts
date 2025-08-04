import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthProviderGuard } from '../guards';

export function AuthProvider() {
	return applyDecorators(UseGuards(AuthProviderGuard));
}
