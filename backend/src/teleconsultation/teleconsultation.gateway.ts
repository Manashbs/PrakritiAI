import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // restrict in production
  },
})
export class TeleconsultationGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('TeleconsultationGateway');

  // Simple in-memory map of users to socket IDs for MVP
  // In production, use Redis adapter
  private activeUsers = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Extract userId from handshake auth
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, client.id);
      client.join(userId); // Join a personal room
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove from active users map
    for (const [userId, socketId] of this.activeUsers.entries()) {
      if (socketId === client.id) {
        this.activeUsers.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join-consultation')
  handleJoinConsultation(
    @MessageBody() data: { appointmentId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.appointmentId);
    this.logger.log(`User ${data.userId} joined consultation room: ${data.appointmentId}`);
    client.broadcast.to(data.appointmentId).emit('user-joined', { userId: data.userId });
  }

  @SubscribeMessage('webrtc-offer')
  handleWebRtcOffer(@MessageBody() data: { to: string; offer: any; from: string }, @ConnectedSocket() client: Socket) {
    this.server.to(data.to).emit('webrtc-offer', { offer: data.offer, from: data.from });
  }

  @SubscribeMessage('webrtc-answer')
  handleWebRtcAnswer(@MessageBody() data: { to: string; answer: any; from: string }, @ConnectedSocket() client: Socket) {
    this.server.to(data.to).emit('webrtc-answer', { answer: data.answer, from: data.from });
  }

  @SubscribeMessage('webrtc-ice-candidate')
  handleIceCandidate(@MessageBody() data: { to: string; candidate: any; from: string }, @ConnectedSocket() client: Socket) {
    this.server.to(data.to).emit('webrtc-ice-candidate', { candidate: data.candidate, from: data.from });
  }

  @SubscribeMessage('chat-message')
  handleChatMessage(@MessageBody() data: { appointmentId: string; message: string; from: string }) {
    this.server.to(data.appointmentId).emit('chat-message', { message: data.message, from: data.from, timestamp: new Date() });
  }
}
