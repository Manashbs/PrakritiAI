import { VectorDbService } from '../vector-db/vector-db.service';
export declare class AiService {
    private vectorDb;
    private readonly logger;
    private readonly ollama;
    constructor(vectorDb: VectorDbService);
    private isOllamaReady;
    getDiagnosticTriage(patientProfile: any, currentSymptoms: string): Promise<{
        response: string;
        model: string;
        citations: string[];
        confidenceScore: number;
        requiresHumanReview: boolean;
    }>;
    chat(messages: {
        role: 'user' | 'assistant';
        content: string;
    }[]): Promise<{
        reply: string;
        model: string;
    }>;
    private callOllama;
    private mockResponse;
}
