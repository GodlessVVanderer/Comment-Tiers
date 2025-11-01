import { GoogleGenAI, Type } from '@google/genai';
import { YouTubeComment, AnalysisResult, CommentCategory } from '../types';
import { COMMENT_CATEGORIES } from '../constants';
import { batch } from '../utils';

const BATCH_SIZE = 50; // Number of comments to process in a single API call

export const analyzeComments = async (
  comments: YouTubeComment[],
  apiKey: string,
  onProgress: (progress: { processed: number; total: number; eta: number }) => void
): Promise<AnalysisResult> => {
  // FIX: Use new GoogleGenAI({apiKey})
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const categories: Record<string, CommentCategory> = {};
  COMMENT_CATEGORIES.forEach(c => {
    categories[c.name] = { ...c, comments: [], count: 0 };
  });

  const commentBatches = batch(comments, BATCH_SIZE);
  let processedCount = 0;
  const startTime = Date.now();

  const systemInstruction = `You are an expert at analyzing YouTube comments. You will be given a batch of comments in JSON format. Your task is to categorize each comment into one of the following categories: ${COMMENT_CATEGORIES.map(c => `"${c.name}"`).join(', ')}. Your response must be a valid JSON array of objects, where each object has two keys: "id" (the original comment ID) and "category" (the assigned category name). Do not include any other text or explanation in your response.`;

  for (const commentBatch of commentBatches) {
    const prompt = `Please categorize the following comments:\n${JSON.stringify(
      commentBatch.map(c => ({ id: c.id, text: c.text }))
    )}`;

    try {
      // FIX: Use ai.models.generateContent
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ['id', 'category'],
            },
          },
        },
      });

      // FIX: Use response.text to get string output
      const jsonText = response.text.trim();
      const results: { id: string; category: string }[] = JSON.parse(jsonText);

      results.forEach(result => {
        const comment = comments.find(c => c.id === result.id);
        if (comment && categories[result.category]) {
          categories[result.category].comments.push(comment);
          categories[result.category].count++;
        }
      });
    } catch (e) {
      console.error('Error processing batch:', e);
      // Skip batch on error to avoid halting entire process
    }

    processedCount += commentBatch.length;
    const elapsedTime = (Date.now() - startTime) / 1000;
    const commentsPerSecond = processedCount / elapsedTime;
    const remainingComments = comments.length - processedCount;
    const eta = commentsPerSecond > 0 ? Math.round(remainingComments / commentsPerSecond) : -1;
    
    onProgress({ processed: processedCount, total: comments.length, eta });
  }

  const sortedCategories = Object.values(categories).sort((a, b) => b.count - a.count);

  return {
    totalComments: comments.length,
    analyzedComments: processedCount,
    categories: sortedCategories,
  };
};
