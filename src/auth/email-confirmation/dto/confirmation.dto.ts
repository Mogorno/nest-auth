import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmationDto {
	@IsString()
	@IsNotEmpty()
	public token: string;
}
