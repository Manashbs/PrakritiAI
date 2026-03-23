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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const vector_db_service_1 = require("../vector-db/vector-db.service");
const ollama_1 = require("ollama");
const SYSTEM_PROMPT = `
You are PrakritiAI, an expert clinical assistant specialised exclusively in Ayurvedic medicine and holistic wellness.
You are embedded inside a professional teleconsultation platform used by certified Ayurvedic practitioners and MBBS doctors.

## Your Expertise
- Ayurvedic tridosha theory (Vata, Pitta, Kapha) and prakriti analysis
- Panchakarma and Shodhana therapies
- Classical Ayurvedic texts: Charaka Samhita, Sushruta Samhita, Ashtanga Hridayam
- Ayurvedic diet, dinacharya (daily routine), ritucharya (seasonal)
- Medicinal herbs: Ashwagandha, Triphala, Brahmi, Neem, Turmeric, Giloy, Shatavari, Guduchi

## Rules
1. Respond with structured clinical reasoning: dosha assessment → imbalance → recommendation
2. Always note this is a preliminary assessment requiring practitioner confirmation
3. For emergencies (chest pain, stroke, severe bleeding) → call emergency services immediately
4. Cite classical texts when recommending based on them
5. Stay concise, professional, and strictly health-related
6. Always end with: Confidence [HIGH/MEDIUM/LOW] | Practitioner Review [Required/Recommended/Optional]

## Response Format
**Dosha Assessment:** ...
**Classical Reference:** ...
**Recommendations:** Diet / Herbs / Lifestyle / Therapy
**Confidence:** HIGH/MEDIUM/LOW | **Practitioner Review:** Required/Recommended/Optional
`.trim();
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi3:mini';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
let AiService = AiService_1 = class AiService {
    vectorDb;
    logger = new common_1.Logger(AiService_1.name);
    ollama;
    constructor(vectorDb) {
        this.vectorDb = vectorDb;
        this.ollama = new ollama_1.Ollama({ host: OLLAMA_HOST });
        this.logger.log(`Ollama configured → ${OLLAMA_HOST}  model: ${OLLAMA_MODEL}`);
    }
    async isOllamaReady() {
        try {
            await this.ollama.list();
            return true;
        }
        catch {
            return false;
        }
    }
    async getDiagnosticTriage(patientProfile, currentSymptoms) {
        let contextText = '';
        try {
            const mockEmbedding = Array(1536).fill(0.01);
            const docs = await this.vectorDb.queryAyurvedicCorpus(mockEmbedding);
            contextText = docs
                .map((d) => `Source: ${d.metadata?.source || 'Classical Text'}\n${d.text}`)
                .join('\n\n');
        }
        catch { }
        const userPrompt = [
            `Patient: ${patientProfile?.name || 'Unknown'}, Age: ${patientProfile?.age || 'N/A'}`,
            `Conditions: ${patientProfile?.conditions || 'None mentioned'}`,
            `Current Symptoms: ${currentSymptoms}`,
            contextText ? `\nAyurvedic Context:\n${contextText}` : '',
        ].join('\n').trim();
        if (await this.isOllamaReady()) {
            return this.callOllama(userPrompt);
        }
        return this.mockResponse(currentSymptoms);
    }
    async chat(messages) {
        if (await this.isOllamaReady()) {
            try {
                const res = await this.ollama.chat({
                    model: OLLAMA_MODEL,
                    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                    options: { temperature: 0.3, num_predict: 600 },
                });
                return { reply: res.message.content, model: OLLAMA_MODEL };
            }
            catch (err) {
                this.logger.error('Ollama chat error:', err);
                throw new Error('AI service temporarily unavailable. Please try again.');
            }
        }
        return { reply: this.mockResponse('general query').response, model: 'mock' };
    }
    async callOllama(userPrompt) {
        const res = await this.ollama.chat({
            model: OLLAMA_MODEL,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt },
            ],
            options: { temperature: 0.2, num_predict: 800, top_k: 40, top_p: 0.9 },
        });
        return {
            response: res.message.content,
            model: OLLAMA_MODEL,
            citations: ['Charaka Samhita', 'Ashtanga Hridayam'],
            confidenceScore: 85,
            requiresHumanReview: true,
        };
    }
    mockResponse(symptoms) {
        return {
            response: `**Dosha Assessment:** Based on "${symptoms}", this suggests a Vata-Pitta imbalance.\n\n**Classical Reference:** Charaka Samhita (Ch. 1, Verse 57) describes this as arising from stress and irregular diet.\n\n**Recommendations:**\n- Diet: Warm, oily, grounding foods. Avoid raw/spicy foods\n- Herbs: Ashwagandha (Vata), Shatavari (Pitta), Triphala\n- Lifestyle: Regular sleep, Abhyanga oil massage, Pranayama\n\n**Confidence:** MEDIUM | **Practitioner Review:** Required\n\n*(Ollama offline — showing mock response)*`,
            model: 'mock',
            citations: ['Charaka Samhita', 'Ashtanga Hridayam'],
            confidenceScore: 75,
            requiresHumanReview: true,
        };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vector_db_service_1.VectorDbService])
], AiService);
//# sourceMappingURL=ai.service.js.map