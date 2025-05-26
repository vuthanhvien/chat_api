import {
  WebSocketServer,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketService } from './socket/socket.service';

@WebSocketGateway(4000, { namespace: 'chat' })
export class AppGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
    this.socketService.setServer(server);
  }
}
