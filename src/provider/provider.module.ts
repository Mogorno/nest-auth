import { Module, DynamicModule } from '@nestjs/common';
import {
	ProviderOptionsSymbol,
	TypeAsyncProviderOptions,
	TypeProviderOptions,
} from './provider.constants';
import { ProviderService } from './provider.service';

@Module({})
export class ProviderModule {
	public static register(options: TypeProviderOptions): DynamicModule {
		return {
			module: ProviderModule,
			providers: [
				{
					useValue: options.services,
					provide: ProviderOptionsSymbol,
				},
				ProviderService,
			],
			exports: [ProviderService],
		};
	}

	public static registerAsync(
		options: TypeAsyncProviderOptions,
	): DynamicModule {
		return {
			module: ProviderModule,
			imports: options.imports,
			providers: [
				{
					useFactory: options.useFactory,
					provide: ProviderOptionsSymbol,
					inject: options.inject,
				},
				ProviderService,
			],
			exports: [ProviderService],
		};
	}
}
