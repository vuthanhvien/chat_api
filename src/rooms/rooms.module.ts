import { Module } from '@nestjs/common';
import { RoomController } from './rooms.controller';
import { RoomService } from './rooms.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, UsersService],
})
export class RoomModule {}
