import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class CreateFileDto {
  name: string;
  size: number;
  type: string;
  userId: string;
  roomId?: string; // Optional, assuming roomId is same as userId
}

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fileData: CreateFileDto) {
    return this.prisma.file.create({
      data: {
        filename: fileData.name,
        size: fileData.size,
        userId: fileData.userId,
        roomId: fileData.roomId,
        path: `/uploads/${fileData.name}`,
        mimetype: fileData.type,
      },
    });
  }
}
