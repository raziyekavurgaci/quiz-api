import { Module } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
@Module({
  exports: [CreateUserDto, UpdateUserDto, LoginDto, RegisterDto],
})
export class SharedModule {}
