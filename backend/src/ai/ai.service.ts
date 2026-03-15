import { Injectable, Logger } from '@nestjs/common';
import { VectorDbService } from '../vector-db/vector-db.service';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private openai: OpenAI;
    private logger = new Logger(AiService.name);

    constructor(private vectorDb: VectorDbService) {
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        } else {
            this.logger.warn('OPENAI_API_KEY not found. AI responses will be mocked.');
        }
    }

    async getDiagnosticTriage(patientProfile: any, currentSymptoms: string) {
        // 1. Convert symptoms to embedding (mocked for MVP unless real OpenAI key exists)
        let embedding = Array(1536).fill(0.01); // Mock embedding

        // 2. Query Vector DB for relevant Ayurvedic texts
        const contextDocs = await this.vectorDb.queryAyurvedicCorpus(embedding);

        // Format context
        const contextText = contextDocs
            .map((doc: any) => `Source: ${doc.metadata?.source || 'Unknown'}\nText: ${doc.text}`)
            .join('\n\n');

        // 3. Construct the prompt with strict guardrails
        const systemPrompt = `
      You are PrakritiAI, an expert Ayurvedic clinical assistant. 
      Your task is to analyze the patient symptoms and provide a preliminary Ayurvedic assessment (Dosha imbalance, potential classical diagnosis) and suggest lifestyle/dietary changes.
      
      RULES:
      1. ONLY use Ayurvedic principles. Do not provide allopathic (Western) medical diagnoses.
      2. If it's an emergency, advise them to visit an ER immediately.
      3. Base your response ON the provided Context from classical texts whenever possible.
      4. Always cite the classical source if provided in the context.
      5. Include a confidence score (0-100%) for your triage assessment.
    `;

        const userPrompt = `
      Patient Data: ${JSON.stringify(patientProfile)}
      Current Symptoms: ${currentSymptoms}
      
      Relevant Ayurvedic Context:
      ${contextText}
      
      Please provide your Ayurvedic triage assessment.
    `;

        // 4. Call LLM
        if (this.openai) {
            try {
                const response = await this.openai.chat.completions.create({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.2, // Low temperature for clinical consistency
                });

                // Add a mock confidence score metric usually derived from logprobs or the model itself
                return {
                    response: response.choices[0].message.content,
                    citations: contextDocs.map((doc: any) => doc.metadata?.source),
                    confidenceScore: 85,
                    requiresHumanReview: true // Always true for MVP
                };
            } catch (error) {
                this.logger.error('Error calling OpenAI', error);
                throw new Error('Failed to generate AI diagnosis');
            }
        } else {
            // Mock response for MVP when no API key is present
            return {
                response: `[MOCK AI RESPONSE] Based on the symptoms of '${currentSymptoms}', it appears there is a Vata-Pitta imbalance. The classical texts suggest avoiding spicy foods and maintaining a cool environment. Please consult an Ayurvedic practitioner for a full diagnosis.`,
                citations: ['Charaka Samhita (Mocked)'],
                confidenceScore: 90,
                requiresHumanReview: true
            };
        }
    }
}
