import { Module } from '@nestjs/common';
import { jwtService } from '../jwt/jwt.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [jwtService],
  exports: [jwtService],
})
export class JwtModule {}
