import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileController } from './file.controller';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [SocketModule],
  providers: [FileService, PrismaService],
  controllers: [FileController],
})
export class MessageModule {}
