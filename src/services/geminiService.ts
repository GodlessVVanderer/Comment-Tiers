import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from '@google/genai';
import { AnalysisResult, Category, Comment, ProgressUpdate } from '@/types';
import { CATEGORIES, CONCURRENCY_LIMIT, GEMINI_BATCH_SIZE } from '@/constants';

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      commentId: { type: Type.STRING },
      category: { type: Type.STRING },
    },
    required: ['commentId', 'category'],
  },
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

export const analyzeComments = async (
  comments: Comment[],
  geminiApiKey: string,
  onUpdate: (progress: ProgressUpdate) => void,
  targetLanguage: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
  
  const batches: Comment[][] = [];
  for (let i = 0; i < comments.length; i += GEMINI_BATCH_SIZE) {
    batches.push(comments.slice(i, i + GEMINI_BATCH_SIZE));
  }

  const categorizedComments: { comment: Comment; categoryName: string }[] = [];
  let completedBatches = 0;
  const startTime = Date.now();
  
  const systemInstruction = `You are an expert YouTube comment analyst. Your task is to classify comments into predefined categories. The user's browser language is ${targetLanguage}. All category names and summaries in your final output MUST be in ${targetLanguage}.`;
  
  const processBatch = async (batch: Comment[]) => {
    const commentsText = batch.map((c) => `COMMENT ID: ${c.id}\nCOMMENT: "${c.text}"`).join('\n---\n');
    const prompt = `
      Analyze the following batch of YouTube comments. For each comment, classify it into ONE of the following categories:
      ${CATEGORIES.map((c) => `- ${c.name}: ${c.prompt}`).join('\n')}

      Your response MUST be a valid JSON array of objects, where each object has a "commentId" and a "category" field.
      The "category" MUST be one of these exact English strings: [${CATEGORIES.map((c) => `"${c.name}"`).join(', ')}].
      
      Here are the comments:
      ---
      ${commentsText}
      ---
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          safetySettings,
        },
      });
      const jsonString = response.text.trim();
      const results: { commentId: string; category: string }[] = JSON.parse(jsonString);

      for (const result of results) {
        const originalComment = comments.find((c) => c.id === result.commentId);
        if (originalComment) {
          categorizedComments.push({
            comment: originalComment,
            categoryName: result.category,
          });
        }
      }
    } catch (e: any) {
      if (e.message?.includes('API key not valid')) {
        throw new Error('GEMINI_INVALID_KEY');
      }
      console.error('Error analyzing batch:', e);
    } finally {
      completedBatches++;
      const percentage = (completedBatches / batches.length) * 100;
      const elapsedTime = (Date.now() - startTime) / 1000;
      const etaSeconds = (elapsedTime / completedBatches) * (batches.length - completedBatches);
      onUpdate({
        percentage,
        batch: completedBatches,
        totalBatches: batches.length,
        etaSeconds: Math.round(etaSeconds),
      });
    }
  };

  const concurrencyPool = new Set();
  for (const batch of batches) {
    const promise = processBatch(batch);
    concurrencyPool.add(promise);
    promise.finally(() => concurrencyPool.delete(promise));
    if (concurrencyPool.size >= CONCURRENCY_LIMIT) {
      await Promise.race(concurrencyPool);
    }
  }
  await Promise.all(concurrencyPool);

  return processFinalAnalysis(categorizedComments, comments.length, ai, targetLanguage);
};

const processFinalAnalysis = async (
  categorizedComments: { comment: Comment; categoryName: string }[],
  totalAnalyzed: number,
  ai: GoogleGenAI,
  targetLanguage: string
): Promise<AnalysisResult> => {
  const summaryPrompt = `
    Based on the following categorized YouTube comments, provide a concise overall summary of the comment section in 2-3 sentences.
    Mention the general sentiment and the most discussed topics. The summary MUST be in ${targetLanguage}.
    Comments:
    ${categorizedComments.slice(0, 100).map((c) => `[${c.categoryName}] ${c.comment.text}`).join('\n')}
  `;

  let summary = 'The comment section features a mix of feedback, questions, and discussions.';
  try {
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: summaryPrompt });
    summary = response.text;
  } catch (e) {
    console.error('Failed to generate summary:', e);
  }

  const categories: Category[] = CATEGORIES.map((cat) => ({ ...cat, comments: [] }));
  const categoryMap = new Map<string, Comment[]>(categories.map((c) => [c.name, c.comments]));

  categorizedComments.forEach(({ comment, categoryName }) => {
    const categoryList = categoryMap.get(categoryName);
    if (categoryList) {
      categoryList.push(comment);
    } else {
      categoryMap.get('Other')?.push(comment); // Fallback
    }
  });

  const topComments = categorizedComments
    .map((c) => c.comment)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 10);
  
  return {
    summary,
    stats: {
        totalComments: 0, // Will be set in the store
        filteredComments: 0, // Will be set in the store
        analyzedComments: totalAnalyzed,
    },
    categories,
    topComments,
  };
};
