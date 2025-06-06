import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketService } from 'src/socket/socket.service';

export class CreateMessageDto {
  content: string;
  type: string;
  roomId: string;
  id: string; // Optional ID, can be generated by the database
}

export class ReadMessageDto {
  messageId: string;
  roomId: string; // Assuming you need roomId to identify the message in a room
}

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService, // Assuming you have a socket service for emitting events
  ) {}

  async create(dto: CreateMessageDto, senderId) {
    const r = await this.prisma.message.create({
      data: {
        id: dto.id,
        content: dto.content,
        type: dto.type,
        senderId: senderId,
        roomId: dto.roomId,
      },
    });
    this.socketService.emitToRoom('message:created', r, dto.roomId);

    // update rooom last message
    this.prisma.room
      .update({
        where: { id: dto.roomId },
        data: {
          lastMessageText: dto.content,
          lastMessageAt: new Date(),
        },
      })
      .then(() => {
        this.socketService.emitToRoom('room:updated', {}, dto.roomId);
      });

    await this.prisma.userRoom
      .findMany({
        where: {
          roomId: dto.roomId,
        },
      })
      .then((userRooms) => {
        userRooms.forEach((userRoom) => {
          if (userRoom.userId !== senderId) {
            this.prisma.userRoom.update({
              where: {
                userId_roomId_unique: {
                  userId: senderId,
                  roomId: dto.roomId,
                },
              },
              data: {
                countUnread: {
                  increment: 1, // Increment unread messages count
                },
                lastmessageId: r.id, // Update last message ID
                lastReadAt: new Date(), // Update last read time
              },
            });
          }
        });
      });

    // find content in dto.content

    return {
      data: r,
      message: 'Message created successfully',
      status: 'success',
      code: 201,
    };
  }

  async find(roomId: string) {
    const res = await this.prisma.message.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: res,
      message: 'Messages retrieved successfully',
      status: 'success',
      code: 200,
    };
  }

  readMessage(readMessageDto: ReadMessageDto, userId: string) {
    // this.messages = [];
    return this.prisma.userRoom.update({
      where: {
        userId_roomId_unique: {
          userId: userId,
          roomId: readMessageDto.roomId,
        },
      },
      data: {
        lastmessageId: readMessageDto.messageId,
        lastReadAt: new Date(),
      },
    });
  }

  deleteMessage(id: string) {
    return this.prisma.message.delete({
      where: { id },
    });
  }
  updateMessage(id: string, dto: CreateMessageDto) {
    return this.prisma.message.update({
      where: { id },
      data: {
        content: dto.content,
        type: dto.type,
      },
    });
  }
}
