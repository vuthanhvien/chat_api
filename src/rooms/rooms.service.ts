import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketService } from 'src/socket/socket.service';

export interface CreateRoomDto {
  name: string;
  description?: string;
  id: string; // Unique identifier for the room
}

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService, // Assuming you have a socket service for emitting events
  ) {}

  async create(dto: CreateRoomDto, userId: string) {
    if (!dto.name) {
      throw new BadRequestException('Tên phòng là bắt buộc');
    }
    // Create the room
    const room = await this.prisma.room.create({
      data: {
        name: dto.name,
        description: dto.description || '',
        ownerId: userId,
      },
    });

    // send a socket.io when create

    const userRooms = await this.prisma.userRoom.findMany({
      where: { roomId: room.id },
      select: { userId: true },
    });
    const memberIds = userRooms.map((ur) => ur.userId).concat(userId);

    this.socketService.emitToUsers('room:add', room, memberIds);
    return room;
  }

  async find(query, userId: string) {
    const rooms = await this.prisma.room.findMany({
      include: {
        UserRoom: true,
      },
      where: {
        OR: [
          {
            UserRoom: {
              some: {
                userId: userId,
              },
            },
          },
          {
            ownerId: userId,
          },
        ],
      },
    });
    return {
      data: rooms,
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
    const r = await this.prisma.room.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });

    this.socketService.emitToUsers('room:update', r, [r.ownerId]);
    return r;
  }

  async addUsersToRoom(roomId: string, userIds: string[]) {
    if (!roomId || !userIds || userIds.length === 0) {
      throw new BadRequestException('Room ID and user IDs are required');
    }

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new BadRequestException('Room not found');
    }

    const out = [];

    // Check if the users already exist in the room
    const existingUsers = await this.prisma.userRoom.findMany({
      where: {
        roomId: roomId,
      },
      select: {
        userId: true,
      },
    });
    const existingUserIds = existingUsers.map((userRoom) => userRoom.userId);
    const newUserIds = userIds.filter(
      (userId) => !existingUserIds.includes(userId),
    );
    console.log('New user IDs to add:', newUserIds, existingUsers);
    if (newUserIds.length === 0) {
      throw new BadRequestException('All users are already in the room');
    }

    newUserIds.forEach(async (userId) => {
      const r = await this.prisma.userRoom.create({
        data: {
          userId: userId,
          roomId: roomId,
        },
      });
      out.push(r);
    });

    // Emit an event to notify users about the new members
    this.socketService.emitToUsers(
      'room:user:add',
      { roomId, userIds: newUserIds },
      [room.ownerId],
    );
    return out;
  }
}
