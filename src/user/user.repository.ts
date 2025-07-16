/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, UpdateUserDto } from '../dto/index';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: RegisterDto) {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'STUDENT',
      },
    });
  }
  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
