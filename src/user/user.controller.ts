import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization, Authorized } from '@/auth/decorators';
import { UserRole } from '@prisma/__generated__';
import { UpdateUserDto } from './dto';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@HttpCode(HttpStatus.OK)
	@Authorization()
	@Get('profile')
	public async findProfile(@Authorized('id') userId: string) {
		return this.userService.findById(userId);
	}

	@HttpCode(HttpStatus.OK)
	@Authorization()
	@Patch('profile')
	public async updateProfile(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserDto,
	) {
		return this.userService.update(userId, dto);
	}

	@HttpCode(HttpStatus.OK)
	@Authorization(UserRole.ADMIN)
	@Get(':userId')
	public async findById(@Param('userId') userId: string) {
		return this.userService.findById(userId);
	}
}
