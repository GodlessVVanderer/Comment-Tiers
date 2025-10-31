
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from '@google/genai';
import { AnalysisResult } from '../types';
import { GEMINI_BATCH_SIZE, GEMINI_CONCURRENCY_LIMIT } from '../constants';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        categories: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    comments: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                    },
                },
                required: ['name', 'summary', 'comments'],
            },
        },
    },
    required: ['categories'],
};

const runConcurrent = <T, R>(
    tasks: T[],
    taskFn: (task: T) => Promise<R>,
    concurrencyLimit: number
): Promise<R[]> => {
    const results: R[] = [];
    let running = 0;
    let taskIndex = 0;

    return new Promise((resolve, reject) => {
        const run = () => {
            if (taskIndex >= tasks.length && running === 0) {
                return resolve(results);
            }

            while (running < concurrencyLimit && taskIndex < tasks.length) {
                running++;
                const currentTaskIndex = taskIndex++;
                taskFn(tasks[currentTaskIndex])
                    .then(result => {
                        results[currentTaskIndex] = result;
                    })
                    .catch(reject)
                    .finally(() => {
                        running--;
                        run();
                    });
            }
        };
        run();
    });
};

export const analyzeComments = async (
    comments: string[],
    apiKey: string,
    onUpdate: (processed: number) => void,
    userLanguage: string
): Promise<AnalysisResult> => {
    const ai = new GoogleGenAI({ apiKey });

    const batches: string[][] = [];
    for (let i = 0; i < comments.length; i += GEMINI_BATCH_SIZE) {
        batches.push(comments.slice(i, i + GEMINI_BATCH_SIZE));
    }

    let processedCount = 0;

    const processBatch = async (batch: string[]): Promise<AnalysisResult> => {
        const prompt = `You are a YouTube comment analysis expert. I will provide you with a JSON array of comments in various languages.
Your task is to analyze them and categorize them into 5-7 insightful themes or topics.
For each theme, provide a concise one-sentence summary and a list of the exact original comment strings that belong to that theme.
Do not create categories for spam, promotions, or generic comments like "first!". Focus on substantive discussion.

IMPORTANT: The final output for category names and summaries MUST be translated into the following language: ${userLanguage}.
The comment strings inside the 'comments' array must remain in their original, untranslated form.

Here are the comments:
${JSON.stringify(batch)}

Respond with a valid JSON object only, matching the specified schema. Do not include any other text or markdown formatting.`;
        
        try {
            // FIX: Moved safetySettings inside the config object to align with the API.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                    // @ts-ignore
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    ]
                },
            });

            const jsonText = response.text.trim() ?? '';
            if (!jsonText) {
                return { categories: [] };
            }
            const result = JSON.parse(jsonText);
            
            processedCount += batch.length;
            onUpdate(processedCount);

            return result;
        } catch (error: any) {
            console.error('Error analyzing batch with Gemini:', error);
            if (error.message.includes('API key not valid')) {
                throw new Error('GEMINI_INVALID_KEY');
            }
            if (error.message.includes('quota')) {
                throw new Error('GEMINI_QUOTA_EXCEEDED');
            }
            throw new Error('GEMINI_API_ERROR');
        }
    };
    
    const batchResults = await runConcurrent(batches, processBatch, GEMINI_CONCURRENCY_LIMIT);

    const mergedResult: AnalysisResult = { categories: [] };
    const categoryMap = new Map<string, { summary: string; comments: string[] }>();

    for (const result of batchResults) {
        if (result && result.categories) {
            for (const category of result.categories) {
                if (categoryMap.has(category.name)) {
                    const existing = categoryMap.get(category.name)!;
                    existing.comments.push(...category.comments);
                } else {
                    categoryMap.set(category.name, { summary: category.summary, comments: category.comments });
                }
            }
        }
    }

    categoryMap.forEach((value, key) => {
        mergedResult.categories.push({
            name: key,
            summary: value.summary,
            comments: value.comments,
        });
    });

    return mergedResult;
};
