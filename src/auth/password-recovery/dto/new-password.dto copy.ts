import { IsPasswordMatchingConstrain } from '@/shared/decorators';
import {
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
	Validate,
} from 'class-validator';

export class NewPasswordDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(128)
	password: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(128)
	@Validate(IsPasswordMatchingConstrain)
	confirmPassword: string;
}
