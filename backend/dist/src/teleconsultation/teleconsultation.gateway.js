"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleconsultationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let TeleconsultationGateway = class TeleconsultationGateway {
    server;
    logger = new common_1.Logger('TeleconsultationGateway');
    activeUsers = new Map();
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        const userId = client.handshake.query.userId;
        if (userId) {
            this.activeUsers.set(userId, client.id);
            client.join(userId);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        for (const [userId, socketId] of this.activeUsers.entries()) {
            if (socketId === client.id) {
                this.activeUsers.delete(userId);
                break;
            }
        }
    }
    handleJoinConsultation(data, client) {
        client.join(data.appointmentId);
        this.logger.log(`User ${data.userId} joined consultation room: ${data.appointmentId}`);
        client.broadcast.to(data.appointmentId).emit('user-joined', { userId: data.userId });
    }
    handleWebRtcOffer(data, client) {
        this.server.to(data.to).emit('webrtc-offer', { offer: data.offer, from: data.from });
    }
    handleWebRtcAnswer(data, client) {
        this.server.to(data.to).emit('webrtc-answer', { answer: data.answer, from: data.from });
    }
    handleIceCandidate(data, client) {
        this.server.to(data.to).emit('webrtc-ice-candidate', { candidate: data.candidate, from: data.from });
    }
    handleChatMessage(data) {
        this.server.to(data.appointmentId).emit('chat-message', { message: data.message, from: data.from, timestamp: new Date() });
    }
};
exports.TeleconsultationGateway = TeleconsultationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TeleconsultationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-consultation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TeleconsultationGateway.prototype, "handleJoinConsultation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-offer'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TeleconsultationGateway.prototype, "handleWebRtcOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-answer'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TeleconsultationGateway.prototype, "handleWebRtcAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc-ice-candidate'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TeleconsultationGateway.prototype, "handleIceCandidate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat-message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeleconsultationGateway.prototype, "handleChatMessage", null);
exports.TeleconsultationGateway = TeleconsultationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], TeleconsultationGateway);
//# sourceMappingURL=teleconsultation.gateway.js.map