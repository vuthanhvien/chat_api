import {
  WebSocketServer,
  OnGatewayInit,
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket/socket.service';

export enum EmitEvent {
  JOIN = 'join',
  LEAVE = 'leave',
  MESSAGE = 'message',
  DISCONNECT = 'disconnect',
  CONNECT = 'connect',
  ERROR = 'error',
}

@WebSocketGateway(4000)
export class AppGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
    this.socketService.setServer(server);
  }

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
  }

  @SubscribeMessage('leave')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
  }

  // @SubscribeMessage('message')
  // handleMessage(
  //   @MessageBody() message: { roomId: string; content: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   console.log(`Received message from ${client.id}:`, message);
  //   this.socketService.emitToRoom('message', message, message.roomId);
  // }
}
