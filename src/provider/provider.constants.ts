import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { BaseOAuthService } from './services/base-oauth.service';

export const ProviderOptionsSymbol = Symbol();

export type TypeProviderOptions = {
	base_url: string;
	services: BaseOAuthService[];
};

export type TypeAsyncProviderOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider, 'useFactory' | 'inject'>;
