import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResetPasswordDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(150)
	email: string;
}
