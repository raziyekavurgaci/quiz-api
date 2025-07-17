import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto, UpdateUserDto } from '../dto/index';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() registerDto: RegisterDto) {
    const user = await this.userService.createUser(registerDto);
    return { success: true, data: user };
  }

  // Kullanıcının kendi profilini güncellemesi için endpoint
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id; // JWT'den gelen kullanıcı ID'si
    const user = await this.userService.updateUser(userId, updateUserDto);
    return { success: true, data: user };
  }

  // Kullanıcının kendi profilini görüntülemesi için endpoint
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    const user = await this.userService.findById(userId);
    return { success: true, data: user };
  }

  @Get('email/:email')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);
    return { success: true, data: user };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return { success: true, data: user };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(id, updateUserDto);
    return { success: true, data: user };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { success: true, message: 'Kullanıcı silindi' };
  }
}
