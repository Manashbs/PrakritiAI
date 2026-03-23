import { AiService } from './ai.service';
import { ProfilesService } from '../profiles/profiles.service';
export declare class AiController {
    private readonly aiService;
    private readonly profilesService;
    constructor(aiService: AiService, profilesService: ProfilesService);
    generateTriage(req: any, symptoms: string): Promise<{
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
}
