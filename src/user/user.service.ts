import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthMethod } from '@prisma/__generated__';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
			include: {
				accounts: true,
			},
		});

		if (!user) {
			throw new NotFoundException(`User with id: ${id} don't found`);
		}

		return user;
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
			include: {
				accounts: true,
			},
		});

		return user;
	}

	public async create(dto: {
		email: string;
		password: string;
		displayName: string;
		picture?: string;
		method: AuthMethod;
		isVerified: boolean;
	}) {
		const { email, password, displayName, picture, method, isVerified } = dto;

		const hashedPassword = password ? await hash(password) : '';

		const user = await this.prismaService.user.create({
			data: {
				email,
				password: hashedPassword,
				displayName,
				picture,
				method,
				isVerified,
			},
			include: {
				accounts: true,
			},
		});

		return user;
	}

	public async update(userId: string, dto: UpdateUserDto) {
		const { email, displayName, isTwoFactorEnabled } = dto;

		const user = await this.findById(userId);

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				email,
				displayName,
				isTwoFactorEnabled,
			},
		});

		return updatedUser;
	}
}
