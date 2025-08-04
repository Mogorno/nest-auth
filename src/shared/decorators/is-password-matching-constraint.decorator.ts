import { RegisterDto } from '@/auth/dto';
import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatchingConstrain
	implements ValidatorConstraintInterface
{
	public validate(
		confirmPassword: string,
		validationArguments: ValidationArguments,
	): Promise<boolean> | boolean {
		const obj = validationArguments.object as RegisterDto;

		return obj.password === confirmPassword;
	}

	public defaultMessage(): string {
		return `Password don't match`;
	}
}
