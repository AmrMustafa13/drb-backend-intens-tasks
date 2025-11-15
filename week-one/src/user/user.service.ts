import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async updateProfile(userId: string, dto: UpdateProfileDto) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const updatedUser = await this.prisma.user.update({
			where: { id: userId },
			data: {
				...(dto.name && { name: dto.name }),
				...(dto.phone && { phone: dto.phone }),
			},
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return updatedUser;
	}

	async getProfile(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}
}
