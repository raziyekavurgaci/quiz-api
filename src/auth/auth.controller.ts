import {
  Body,
  Controller,
  Post,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../dto/index';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('logout')
  async logout(@Headers('authorization') authorization: string) {
    if (!authorization?.startsWith('Bearer ')) {
      throw new BadRequestException('Geçersiz yetkilendirme başlığı');
    }
    const token = authorization.split(' ')[1];
    return this.authService.logout(token);
  }

  @Post('logout-all')
  async logoutAll(@Headers('authorization') authorization: string) {
    if (!authorization?.startsWith('Bearer ')) {
      throw new BadRequestException('Geçersiz yetkilendirme başlığı');
    }
    const token = authorization.split(' ')[1];
    return this.authService.logoutAll(token);
  }
}
