import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [UserModule, AuthModule, QuestionModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
