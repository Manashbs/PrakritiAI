export declare class VectorDbService {
    private readonly logger;
    private pinecone;
    constructor();
    private initPinecone;
    queryAyurvedicCorpus(queryEmbedding: number[], topK?: number): Promise<{
        text: string;
        score: number;
        metadata: {
            source: string;
        };
    }[]>;
    indexDocument(vectors: any[]): Promise<void>;
}
