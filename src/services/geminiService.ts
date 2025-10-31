import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { Category, Comment } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = (apiKey: string): GoogleGenAI => {
    // Re-create client in case API key changes.
    // In this app, the key is persisted and loaded once, but this is safer.
    ai = new GoogleGenAI({ apiKey });
    return ai;
};

const BATCH_SIZE = 50;

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        categories: {
            type: Type.ARRAY,
            description: 'An array of comment categories.',
            items: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        description: 'A concise, descriptive name for the category (e.g., "Positive Feedback", "Questions", "Bug Reports").'
                    },
                    summary: {
                        type: Type.STRING,
                        description: 'A 1-2 sentence summary of the comments in this category.'
                    },
                    comment_ids: {
                        type: Type.ARRAY,
                        description: 'An array of comment IDs belonging to this category.',
                        items: {
                            type: Type.STRING
                        }
                    }
                },
                required: ['category', 'summary', 'comment_ids']
            }
        }
    },
    required: ['categories']
};

export const analyzeComments = async (
    comments: Comment[],
    apiKey: string,
    onProgress: (processed: number, total: number) => void
): Promise<Category[]> => {
    const aiClient = getAiClient(apiKey);
    // FIX: Use the recommended 'gemini-2.5-flash' model instead of the deprecated 'gemini-1.5-flash'.
    const model = 'gemini-2.5-flash';

    const commentMap = new Map(comments.map(c => [c.id, c]));
    const allCategories: Record<string, Category> = {};
    const totalBatches = Math.ceil(comments.length / BATCH_SIZE);

    for (let i = 0; i < comments.length; i += BATCH_SIZE) {
        const batch = comments.slice(i, i + BATCH_SIZE);
        const batchNumber = (i / BATCH_SIZE) + 1;
        onProgress(batchNumber, totalBatches);

        const prompt = `
            Analyze the following YouTube comments and group them into insightful categories.
            For each category, provide a short summary.
            Each comment must be assigned to one category only.

            Here are the comments in JSON format (id and text only):
            ${JSON.stringify(batch.map(c => ({ id: c.id, text: c.text })))}

            Your response must be a JSON object that strictly follows the provided schema.
        `;

        try {
            const response: GenerateContentResponse = await aiClient.models.generateContent({
                model,
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: analysisSchema,
                },
            });

            const jsonText = response.text.trim();
            const result = JSON.parse(jsonText);
            
            if (result.categories && Array.isArray(result.categories)) {
                for (const cat of result.categories) {
                    if (!allCategories[cat.category]) {
                        allCategories[cat.category] = {
                            category: cat.category,
                            summary: cat.summary,
                            comments: []
                        };
                    }

                    if (cat.comment_ids) {
                        for (const commentId of cat.comment_ids) {
                            const comment = commentMap.get(commentId);
                            if (comment && !allCategories[cat.category].comments.some(c => c.id === commentId)) {
                                allCategories[cat.category].comments.push(comment);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing batch ${batchNumber}:`, error);
            if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('400'))) {
                 throw new Error(`Gemini API Error: Please check if your API key is correct and has billing enabled. Original error: ${error.message}`);
            }
        }
    }

    return Object.values(allCategories).filter(c => c.comments.length > 0);
};
