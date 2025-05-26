import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private io: Server;

  setServer(io: Server) {
    this.io = io;
  }

  emitToUsers(event: string, data: any, userIds: string[]) {
    if (!this.io) return;
    userIds.forEach((userId) => {
      this.io.to(userId).emit(event, data);
    });
  }

  emitToRoom(event: string, data: any, roomId: string) {
    console.log(this.io);
    if (!this.io) return;
    console.log(`Emitting to room ${roomId} event ${event}`, data);
    this.io.to(roomId).emit(event, data);
  }
}
