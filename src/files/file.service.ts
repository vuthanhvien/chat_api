import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async saveFile(meta: {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    uploaderId: string;
  }) {
    const file = await this.prisma.file.create({
      data: {
        ...meta,
      },
    });
    await this.prisma.fileHistory.create({
      data: {
        fileId: file.id,
        action: 'upload',
        userId: meta.uploaderId,
      },
    });
    return file;
  }

  async recordHistory(fileId: string, action: string, userId: string) {
    return this.prisma.fileHistory.create({
      data: { fileId, action, userId },
    });
  }

  async getFileHistory(fileId: string) {
    return this.prisma.fileHistory.findMany({
      where: { fileId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
