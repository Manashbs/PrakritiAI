import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class TeleconsultationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    private activeUsers;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinConsultation(data: {
        appointmentId: string;
        userId: string;
    }, client: Socket): void;
    handleWebRtcOffer(data: {
        to: string;
        offer: any;
        from: string;
    }, client: Socket): void;
    handleWebRtcAnswer(data: {
        to: string;
        answer: any;
        from: string;
    }, client: Socket): void;
    handleIceCandidate(data: {
        to: string;
        candidate: any;
        from: string;
    }, client: Socket): void;
    handleChatMessage(data: {
        appointmentId: string;
        message: string;
        from: string;
    }): void;
}
