import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { RoomModule } from './rooms/rooms.module';
import { MessageModule } from './messages/messages.module';
import { AppGateway } from './app.gateway';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CommonModule,
    RoomModule,
    MessageModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
