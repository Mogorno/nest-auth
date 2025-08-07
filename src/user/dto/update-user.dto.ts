import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(150)
	email?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(100)
	displayName?: string;

	@IsOptional()
	@IsBoolean()
	isTwoFactorEnabled?: boolean;
}
