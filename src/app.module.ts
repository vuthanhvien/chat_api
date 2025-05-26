import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { RoomModule } from './rooms/rooms.module';
import { MessageModule } from './messages/messages.module';
import { AppGateway } from './app.gateway';
import { SocketService } from './socket/socket.service';

@Module({
  imports: [AuthModule, UsersModule, CommonModule, RoomModule, MessageModule],
  controllers: [AppController],
  providers: [AppService, AppGateway, SocketService],
})
export class AppModule {}
