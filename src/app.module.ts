import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { RoomModule } from './rooms/rooms.module';
import { MessageModule } from './messages/messages.module';

@Module({
  imports: [AuthModule, UsersModule, MessageModule, CommonModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
