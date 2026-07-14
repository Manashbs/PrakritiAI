import { Injectable, Logger } from '@nestjs/common';
import { VectorDbService } from '../vector-db/vector-db.service';
import { Ollama } from 'ollama';

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
const OLLAMA_HOST  = process.env.OLLAMA_HOST  || 'http://localhost:11434';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly ollama: Ollama;

    constructor(private vectorDb: VectorDbService) {
        this.ollama = new Ollama({ host: OLLAMA_HOST });
        this.logger.log(`Ollama configured → ${OLLAMA_HOST}  model: ${OLLAMA_MODEL}`);
    }

    /** Live-check each request — no restart required after Ollama is installed */
    private async isOllamaReady(): Promise<boolean> {
        try { await this.ollama.list(); return true; }
        catch { return false; }
    }

    // ─── Ayurvedic Triage with optional RAG enrichment ────────────────────────
    async getDiagnosticTriage(patientProfile: any, currentSymptoms: string) {
        let contextText = '';
        try {
            const mockEmbedding = Array(1536).fill(0.01);
            const docs = await this.vectorDb.queryAyurvedicCorpus(mockEmbedding);
            contextText = docs
                .map((d: any) => `Source: ${d.metadata?.source || 'Classical Text'}\n${d.text}`)
                .join('\n\n');
        } catch { /* vector DB not populated yet — proceed without RAG */ }

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

    // ─── General conversational chat ──────────────────────────────────────────
    async chat(messages: { role: 'user' | 'assistant'; content: string }[]) {
        if (await this.isOllamaReady()) {
            try {
                const res = await this.ollama.chat({
                    model: OLLAMA_MODEL,
                    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                    options: { temperature: 0.3, num_predict: 600 },
                });
                return { reply: res.message.content, model: OLLAMA_MODEL };
            } catch (err) {
                this.logger.error('Ollama chat error:', err);
                throw new Error('AI service temporarily unavailable. Please try again.');
            }
        }
        return { reply: this.mockResponse('general query').response, model: 'mock' };
    }

    // ─── Private helpers ──────────────────────────────────────────────────────
    private async callOllama(userPrompt: string) {
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

    private mockResponse(symptoms: string) {
        return {
            response: `**Dosha Assessment:** Based on "${symptoms}", this suggests a Vata-Pitta imbalance.\n\n**Classical Reference:** Charaka Samhita (Ch. 1, Verse 57) describes this as arising from stress and irregular diet.\n\n**Recommendations:**\n- Diet: Warm, oily, grounding foods. Avoid raw/spicy foods\n- Herbs: Ashwagandha (Vata), Shatavari (Pitta), Triphala\n- Lifestyle: Regular sleep, Abhyanga oil massage, Pranayama\n\n**Confidence:** MEDIUM | **Practitioner Review:** Required\n\n*(Ollama offline — showing mock response)*`,
            model: 'mock',
            citations: ['Charaka Samhita', 'Ashtanga Hridayam'],
            confidenceScore: 75,
            requiresHumanReview: true,
        };
    }
}
