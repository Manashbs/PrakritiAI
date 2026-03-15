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
var VectorDbService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorDbService = void 0;
const common_1 = require("@nestjs/common");
const pinecone_1 = require("@pinecone-database/pinecone");
let VectorDbService = VectorDbService_1 = class VectorDbService {
    logger = new common_1.Logger(VectorDbService_1.name);
    pinecone;
    constructor() {
        this.initPinecone();
    }
    initPinecone() {
        try {
            if (process.env.PINECONE_API_KEY) {
                this.pinecone = new pinecone_1.Pinecone({
                    apiKey: process.env.PINECONE_API_KEY,
                });
                this.logger.log('Pinecone client initialized successfully.');
            }
            else {
                this.logger.warn('PINECONE_API_KEY not found. Vector DB skipped for now.');
            }
        }
        catch (error) {
            this.logger.error('Failed to initialize Pinecone client', error);
        }
    }
    async queryAyurvedicCorpus(queryEmbedding, topK = 5) {
        if (!this.pinecone)
            return [];
        return [
            { text: "Dummy classical text reference", score: 0.98, metadata: { source: "Charaka Samhita" } }
        ];
    }
    async indexDocument(vectors) {
        if (!this.pinecone)
            return;
    }
};
exports.VectorDbService = VectorDbService;
exports.VectorDbService = VectorDbService = VectorDbService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VectorDbService);
//# sourceMappingURL=vector-db.service.js.map