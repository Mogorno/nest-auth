import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
	ProviderOptionsSymbol,
	TypeProviderOptions,
} from './provider.constants';
import { BaseOAuthService } from './services/base-oauth.service';

@Injectable()
export class ProviderService implements OnModuleInit {
	public constructor(
		@Inject(ProviderOptionsSymbol)
		private readonly options: TypeProviderOptions,
	) {}

	public onModuleInit() {
		for (const provider of this.options.services) {
			provider.base_url = this.options.base_url;
		}
	}

	public findByService(service: string): BaseOAuthService | null {
		return (
			this.options.services.find((provider) => provider.name === service) ??
			null
		);
	}
}
