import { Module } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Module({
  exports: [CreateUserDto, UpdateUserDto],
})
export class SharedModule {}
