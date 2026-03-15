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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const vector_db_service_1 = require("../vector-db/vector-db.service");
const openai_1 = __importDefault(require("openai"));
let AiService = AiService_1 = class AiService {
    vectorDb;
    openai;
    logger = new common_1.Logger(AiService_1.name);
    constructor(vectorDb) {
        this.vectorDb = vectorDb;
        if (process.env.OPENAI_API_KEY) {
            this.openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
        }
        else {
            this.logger.warn('OPENAI_API_KEY not found. AI responses will be mocked.');
        }
    }
    async getDiagnosticTriage(patientProfile, currentSymptoms) {
        let embedding = Array(1536).fill(0.01);
        const contextDocs = await this.vectorDb.queryAyurvedicCorpus(embedding);
        const contextText = contextDocs
            .map((doc) => `Source: ${doc.metadata?.source || 'Unknown'}\nText: ${doc.text}`)
            .join('\n\n');
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
        if (this.openai) {
            try {
                const response = await this.openai.chat.completions.create({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.2,
                });
                return {
                    response: response.choices[0].message.content,
                    citations: contextDocs.map((doc) => doc.metadata?.source),
                    confidenceScore: 85,
                    requiresHumanReview: true
                };
            }
            catch (error) {
                this.logger.error('Error calling OpenAI', error);
                throw new Error('Failed to generate AI diagnosis');
            }
        }
        else {
            return {
                response: `[MOCK AI RESPONSE] Based on the symptoms of '${currentSymptoms}', it appears there is a Vata-Pitta imbalance. The classical texts suggest avoiding spicy foods and maintaining a cool environment. Please consult an Ayurvedic practitioner for a full diagnosis.`,
                citations: ['Charaka Samhita (Mocked)'],
                confidenceScore: 90,
                requiresHumanReview: true
            };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vector_db_service_1.VectorDbService])
], AiService);
//# sourceMappingURL=ai.service.js.map