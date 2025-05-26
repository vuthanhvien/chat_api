import { Module } from '@nestjs/common';
import { MessageService } from './messages.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageController } from './messages.controller';
import { SocketService } from 'src/socket/socket.service';

@Module({
  providers: [MessageService, PrismaService, SocketService],
  controllers: [MessageController],
  imports: [],
})
export class MessageModule {}
