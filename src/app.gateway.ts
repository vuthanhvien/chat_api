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
    console.log(`Socket ${client.id} joined room ${roomId}`);
    client.emit('joined', roomId);
  }

  @SubscribeMessage('leave')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    console.log(`Socket ${client.id} left room ${roomId}`);
    client.emit('left', roomId);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: { roomId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Received message from ${client.id}:`, message);
    this.socketService.emitToRoom('message', message, message.roomId);
  }
  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Socket ${client.id} disconnected`);
    // Handle any cleanup or notifications here if needed
  }
  @SubscribeMessage('connect')
  handleConnect(@ConnectedSocket() client: Socket) {
    console.log(`Socket ${client.id} connected`);
    // Handle any initialization or notifications here if needed
  }
  @SubscribeMessage('error')
  handleError(
    @MessageBody() error: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.error(`Error from socket ${client.id}:`, error.message);
    client.emit('error', { message: 'An error occurred' });
  }
}
