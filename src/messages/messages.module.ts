import { Module } from '@nestjs/common';
import { MessageService } from './messages.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageController } from './messages.controller';
// import { ChatGateway } from './messages/.gateway';

@Module({
  providers: [MessageService, PrismaService],
  controllers: [MessageController],
})
export class MessageModule {}
