import { Module } from '@nestjs/common';
import { MessageService } from './messages.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageController } from './messages.controller';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [SocketModule],
  providers: [MessageService, PrismaService],
  controllers: [MessageController],
})
export class MessageModule {}
