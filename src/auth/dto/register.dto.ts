import { IsPasswordMatchingConstrain } from '@/shared/decorators';
import { User } from '@prisma/__generated__';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
	Validate,
} from 'class-validator';

type Register = Pick<User, 'email' | 'password' | 'displayName'>;

export class RegisterDto implements Register {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(150)
	email: string;

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

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(100)
	displayName: string;
}
