import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async updateProfile() {}
	async getProfile() {
        return 'hello this is the get profile function'
    }
}
