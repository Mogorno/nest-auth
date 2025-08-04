import { User } from '@prisma/__generated__';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

type Login = Pick<User, 'email' | 'password'>;

export class LoginDto implements Login {
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
}
