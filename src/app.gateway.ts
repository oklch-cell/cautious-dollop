import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';

import type { Socket, Server } from 'socket.io';
import { UserService } from './modules/user/user.service.js';
import { MessageService } from './modules/message/message.service.js';

import 'dotenv/config';

type PrivateMessage = {
  data: string;
  sender: string;
  receiver: string;
};

type PublicMessage = {
  data: string;
  sender: string;
  group: string;
};

const users = new Map<string, Socket>();

@WebSocketGateway({
  path: "/api/socket",
  cors: { origin: process.env.CLIENT_ORIGINS!, credentials: true },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const { user, id, token } = client.handshake.query;

    if (!user || !id || !token) {
      client.emit('error', 'Missing query parameters');
      return client.disconnect();
    }

    const { access_token, username } = await this.userService.getById(
      String(id),
    );

    if (token !== access_token || user !== username) {
      client.emit('error', 'Unauthenticated');
      return client.disconnect();
    }

    if (typeof username === 'string') {
      users.set(username, client);
      this.server.emit('user-list', Array.from(users.keys()));
      console.log(Array.from(users.keys()));
      console.log(`${client.id} -> ${username} connected!`);
    }
  }

  handleDisconnect(client: Socket) {
    const { user } = client.handshake.query;

    if (typeof user === 'string') {
      users.delete(user);
      this.server.emit('user-list', Array.from(users.keys()));
      console.log(`${client.id} -> ${user} disconnected!`);
    }
  }

  @SubscribeMessage('public-message')
  async handlePublicMessage(@MessageBody() message: string) {
    const { data, sender, group }: PublicMessage = JSON.parse(message);

    console.log(data, sender, group);

    this.server.emit(`${group}-room`, JSON.stringify({ data, sender }));
    await this.messageService.create({ content: data, sender, group });
  }

  @SubscribeMessage('private-message')
  async handlePrivateMessage(@MessageBody() message: string) {
    const { data, sender, receiver }: PrivateMessage = JSON.parse(message);

    const user = users.get(receiver);
    user?.emit('private-message', JSON.stringify({ data, sender }));

    console.log(`[${sender}]: ${data} -> ${receiver}`);
  }
}
