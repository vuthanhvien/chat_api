import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CreateRoomDto {
  name: string;
  description?: string;
  id: string; // Unique identifier for the room
}

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoomDto) {
    if (!dto.name) {
      throw new BadRequestException('Tên phòng là bắt buộc');
    }
    // Create the room
    const room = await this.prisma.room.create({
      data: {
        name: dto.name,
      },
    });
    return room;
  }

  async find({
    page = 1,
    pageSize = 10,
  }: {
    page?: number;
    pageSize?: number;
  }) {
    const skip = (page - 1) * pageSize;
    const rooms = await this.prisma.room.findMany({
      skip,
      take: pageSize,
    });
    const total = await this.prisma.room.count();
    return {
      data: rooms,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
  async findById(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.room.findMany();
  }

  async findOne(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: CreateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }
}
