import { Module } from '@nestjs/common';
import { RoomController } from './rooms.controller';
import { RoomService } from './rooms.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { SocketService } from 'src/socket/socket.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, UsersService, SocketService],
})
export class RoomModule {}
