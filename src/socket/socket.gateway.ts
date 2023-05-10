import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  handleConnection(client: any, ...args: any[]) {
    client.emit('connection_status', client.id + ' Connected To Server ' + process.env.APP_ID)
  }

  handleDisconnect(client: any) {
    console.log('connection_status', client.id + ' Disconnected From Server ' + process.env.APP_ID)
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    if (data.room == 'ALL') {
      this.server.emit('messages', data.message)
    } else {
      client.join(data.room);
      client.to(data.room).emit('messages', data.message)
    }
  }

  @SubscribeMessage('join_room')
  async joinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
  }
}