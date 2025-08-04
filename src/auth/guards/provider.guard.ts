import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ProviderService } from '@/provider/provider.service';

@Injectable()
export class AuthProviderGuard implements CanActivate {
	constructor(private readonly providerService: ProviderService) {}

	public canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();
		const provider = request.params.provider;

		const providerInstance = this.providerService.findByService(provider);

		if (!providerInstance) {
			throw new NotFoundException(
				`Provider with name: ${provider} not found. Please try again`,
			);
		}

		return true;
	}
}
