/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto, UpdateUserDto } from '../dto/index';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findUserByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('bu e-posta kayıtlı');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return await this.userRepository.createUser({
      ...registerDto,
      password: hashedPassword,
    });
  }
  async findByEmail(email: string) {
    return await this.userRepository.findUserByEmail(email);
  }
  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user)
      throw new BadRequestException('Güncellenecek kullanıcı bulunamadı');

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    return await this.userRepository.updateUser(id, dto);
  }
  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestException('Kullanıcı bulunamadı');
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findUserByEmail(id);
    if (!user) throw new BadRequestException('Silinecek kullanıcı bulunamadı');
    return await this.userRepository.deleteUser(id);
  }
}
