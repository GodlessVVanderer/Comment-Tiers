

import { GoogleGenAI, Type } from '@google/genai';
// FIX: Import ProgressUpdate to ensure type conformity for progress callbacks.
import type { Comment, Category, ProgressUpdate } from '../types';
import { BATCH_SIZE, CONCURRENCY_LIMIT } from '../constants';

// Schema for the expected JSON response from the Gemini API.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    categories: {
      type: Type.ARRAY,
      description: 'An array of comment categories.',
      items: {
        type: Type.OBJECT,
        properties: {
          categoryTitle: {
            type: Type.STRING,
            description: 'A concise, descriptive title for the category (e.g., "Positive Feedback", "Feature Requests").',
          },
          summary: {
            type: Type.STRING,
            description: 'A one-sentence summary of the main theme of the comments in this category.',
          },
          comment_ids: {
            type: Type.ARRAY,
            description: 'An array of the original string IDs of the comments that belong to this category.',
            items: {
              type: Type.STRING,
            },
          },
        },
        required: ['categoryTitle', 'summary', 'comment_ids'],
      },
    },
  },
  required: ['categories'],
};


const systemInstruction = `You are an expert YouTube comment analyst. Your task is to analyze the following batch of YouTube comments and group them into insightful, distinct categories based on recurring themes, sentiments, and topics.

Instructions:
1.  **Analyze and Categorize**: Read all comments and identify the main topics of discussion. Create categories that are specific and meaningful. Avoid generic categories like "General Comments" or "Questions" unless they are truly distinct.
2.  **Provide Title and Summary**: For each category, create a short, descriptive \`categoryTitle\` and a one-sentence \`summary\` that captures the essence of the comments within it.
3.  **Assign Comments**: Assign each comment to the single most appropriate category. A comment should only belong to one category. Ensure all provided comment IDs are assigned.
4.  **Format Output**: Return your analysis as a JSON object that strictly adheres to the provided schema. The output must contain a 'categories' array. Each category object in the array must have 'categoryTitle', 'summary', and 'comment_ids' properties. \`comment_ids\` must be an array of strings.`;

/**
 * Analyzes a list of comments using the Gemini API.
 * 
 * @param comments - The array of comments to analyze.
 * @param apiKey - The Gemini API key.
 * @param onProgress - A callback function to report progress.
 * @returns A promise that resolves to an array of categories.
 */
export const analyzeComments = async (
  comments: Comment[],
  apiKey: string,
  // FIX: Use the ProgressUpdate type for the onProgress callback to ensure consistency.
  onProgress: (update: ProgressUpdate) => void
): Promise<Category[]> => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('GEMINI_INVALID_KEY');
  }

  // FIX: Per coding guidelines, apiKey must be passed as a named parameter.
  const ai = new GoogleGenAI({apiKey});

  // Create a map for quick comment lookup by ID.
  const commentsMap = new Map(comments.map(c => [c.id, c]));

  // Split comments into batches.
  const batches: Comment[][] = [];
  for (let i = 0; i < comments.length; i += BATCH_SIZE) {
    batches.push(comments.slice(i, i + BATCH_SIZE));
  }
  
  const totalBatches = batches.length;
  let processedComments = 0;
  const batchProcessingTimes: number[] = [];

  const allCategories: Map<string, Category> = new Map();

  // Process batches with a concurrency limit.
  const processBatch = async (batch: Comment[], batchIndex: number) => {
    const startTime = Date.now();
    const prompt = `Here is a batch of comments in JSON format. Please analyze them according to the instructions:\n\n${JSON.stringify(batch.map(({ id, text }) => ({ id, text })))}`;
    
    try {
      // FIX: Use ai.models.generateContent instead of creating a model instance first.
      const response = await ai.models.generateContent({
        // FIX: Per coding guidelines, use 'gemini-2.5-flash' for basic text tasks.
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });

      // FIX: Per coding guidelines, access the text directly from the response object.
      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText) as { categories: { categoryTitle: string, summary: string, comment_ids: string[] }[] };

      if (!result || !result.categories) {
        throw new Error("Invalid response structure from Gemini API.");
      }
      
      return result.categories;
    } catch (error) {
        console.error(`Error processing batch ${batchIndex + 1}:`, error);
        // Try to parse Gemini error response for more details
        if (error instanceof Error && 'message' in error) {
            try {
                // Gemini API often wraps errors in a JSON string within the message
                const match = error.message.match(/\[(.*)\]\s*({.*})/);
                if (match && match[2]) {
                  const errorJson = JSON.parse(match[2]);
                  if (errorJson.error && errorJson.error.message) {
                    throw new Error(`Gemini API Error: ${errorJson.error.message}`);
                  }
                }
            } catch (e) {
                // Not a JSON error message, re-throw original
            }
        }
        throw error; // Re-throw if parsing fails or for other error types
    } finally {
        const endTime = Date.now();
        const duration = endTime - startTime;
        batchProcessingTimes.push(duration);
        
        // Use the length of the current batch for accuracy
        const currentBatchSize = batch.length;
        processedComments += currentBatchSize;
        
        // Calculate ETA
        const avgTimePerComment = batchProcessingTimes.reduce((sum, time, index) => {
            const batchSize = batches[index].length;
            return sum + (time / batchSize);
        }, 0) / batchProcessingTimes.length;
        
        const remainingComments = comments.length - processedComments;
        const eta = remainingComments > 0 ? (avgTimePerComment * remainingComments) / 1000 : null;

        onProgress({
            processed: Math.min(processedComments, comments.length),
            total: comments.length,
            currentBatch: batchIndex + 1,
            totalBatches,
            // FIX: Rename 'eta' to 'etaSeconds' to match the ProgressUpdate type.
            etaSeconds: eta,
        });
    }
  };

  const concurrencyPool = new Set<Promise<any>>();
  const results = [];
  let batchIndex = 0;

  for (const batch of batches) {
    while (concurrencyPool.size >= CONCURRENCY_LIMIT) {
      await Promise.race(Array.from(concurrencyPool));
    }
    const promise = processBatch(batch, batchIndex++)
      .then(result => {
        concurrencyPool.delete(promise);
        return result;
      })
      .catch(error => {
        concurrencyPool.delete(promise);
        throw error;
      });
    concurrencyPool.add(promise);
    results.push(promise);
  }

  const batchResults = await Promise.all(results);

  // Merge categories from all batches.
  for (const categories of batchResults) {
    if (!categories) continue;
    for (const cat of categories) {
      const existingCategory = allCategories.get(cat.categoryTitle);
      const commentsForCategory = cat.comment_ids
        .map(id => commentsMap.get(id))
        .filter((c): c is Comment => c !== undefined);

      if (existingCategory) {
        existingCategory.comments.push(...commentsForCategory);
      } else {
        allCategories.set(cat.categoryTitle, {
          categoryTitle: cat.categoryTitle,
          summary: cat.summary,
          comments: commentsForCategory,
        });
      }
    }
  }

  return Array.from(allCategories.values());
};
