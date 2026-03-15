import { VectorDbService } from '../vector-db/vector-db.service';
export declare class AiService {
    private vectorDb;
    private openai;
    private logger;
    constructor(vectorDb: VectorDbService);
    getDiagnosticTriage(patientProfile: any, currentSymptoms: string): Promise<{
        response: string;
        citations: any[];
        confidenceScore: number;
        requiresHumanReview: boolean;
    }>;
}
