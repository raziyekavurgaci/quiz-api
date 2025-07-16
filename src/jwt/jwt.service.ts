/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class jwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  createAccessToken(userId: string) {
    const payload = {
      sub: userId,
      type: 'access_token',
    };
    return this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  createRefreshToken(userId: string) {
    const payload = {
      sub: userId,
      type: 'refresh_token',
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    // Refresh token'ı veritabanına kaydet
    this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün
      },
    });

    return token;
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      if (payload.type !== 'access_token') {
        throw new UnauthorizedException('Geçersiz token tipi');
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Geçersiz access token');
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      if (payload.type !== 'refresh_token') {
        throw new UnauthorizedException('geçersiz token tipi');
      }

      // Veritabanında token'ın geçerli olup olmadığını kontrol et
      const tokenRecord = await this.prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          revoked: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!tokenRecord) {
        throw new UnauthorizedException(
          'Geçersiz veya süresi dolmuş refresh token',
        );
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('kullanıcı bulunamadı');
      }
      const newAccessToken = this.createAccessToken(user.id);
      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('geçersiz refresh token');
    }
  }

  async revokeRefreshToken(refreshToken: string) {
    try {
      // Token'ı doğrula
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Token'ı veritabanında geçersiz kıl
      await this.prisma.refreshToken.updateMany({
        where: {
          token: refreshToken,
          userId: payload.sub,
        },
        data: {
          revoked: true,
        },
      });

      return true;
    } catch (error) {
      throw new UnauthorizedException('Geçersiz refresh token');
    }
  }

  async revokeAllRefreshTokens(accessToken: string) {
    try {
      // Access token'ı doğrula
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      if (payload.type !== 'access_token') {
        throw new UnauthorizedException('Geçersiz token tipi');
      }

      // Kullanıcının tüm refresh token'larını geçersiz kıl
      await this.prisma.refreshToken.updateMany({
        where: {
          userId: payload.sub,
          revoked: false,
        },
        data: {
          revoked: true,
        },
      });

      return true;
    } catch (error) {
      throw new UnauthorizedException('Geçersiz access token');
    }
  }
}
