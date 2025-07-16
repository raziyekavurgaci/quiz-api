/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { RegisterDto, LoginDto } from '../dto/index';
import { jwtService } from '../jwt/jwt.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: jwtService,
  ) {}

  async checkByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    return user ? user : null;
  }

  async register(data: RegisterDto) {
    const existingUser = await this.checkByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Bu email adresi zaten kullanımda');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const accessToken = this.jwtService.createAccessToken(newUser.id);
    const refreshToken = this.jwtService.createRefreshToken(newUser.id);

    return {
      message: 'Kullanıcı başarıyla kaydedildi',
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDto) {
    const user = await this.checkByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Email veya şifre hatalı');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Email veya şifre hatalı');
    }

    const accessToken = this.jwtService.createAccessToken(user.id);
    const refreshToken = this.jwtService.createRefreshToken(user.id);

    return {
      message: 'Giriş başarılı',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string) {
    try {
      if (!token) {
        throw new BadRequestException('Token bulunamadı');
      }

      await this.jwtService.revokeRefreshToken(token);

      return {
        message: 'Başarıyla çıkış yapıldı',
        success: true,
      };
    } catch (error) {
      throw new BadRequestException('Çıkış yapılırken bir hata oluştu');
    }
  }

  async logoutAll(authHeader: string) {
    try {
      if (!authHeader?.startsWith('Bearer ')) {
        throw new BadRequestException('Geçersiz yetkilendirme başlığı');
      }

      const token = authHeader.split(' ')[1];
      await this.jwtService.revokeAllRefreshTokens(token);

      return {
        message: 'Tüm oturumlardan başarıyla çıkış yapıldı',
        success: true,
      };
    } catch (error) {
      throw new BadRequestException('Çıkış yapılırken bir hata oluştu');
    }
  }
}
