import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import type { Comment, Category, AnalysisStats, ProgressUpdate } from '../types';

const BATCH_SIZE = 200; // Process 200 comments per API call
const CONCURRENCY_LIMIT = 10; // Number of parallel requests to the API
const NGRAM_SIZE = 5; // "more than 4 words"
const NGRAM_SPAM_THRESHOLD = 2; // Occurs in 2 or more unique comments
const MIN_WORD_COUNT = 25; // A proxy for "more than 2 sentences"

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      categoryTitle: {
        type: Type.STRING,
        description: "A concise, descriptive title for the discussion category (e.g., 'Ethical Concerns', 'Technical Analysis').",
      },
      summary: {
        type: Type.STRING,
        description: "A one-sentence summary of the main point of this comment category.",
      },
      comments: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING }, 
            author: { type: Type.STRING },
            text: { type: Type.STRING },
          },
          required: ["id", "author", "text"], 
        },
        description: "A list of comments that fit into this category.",
      },
    },
    required: ["categoryTitle", "summary", "comments"],
  },
};

const preFilterComments = (comments: Comment[]): Comment[] => {
    // --- Start of duplicate detection logic ---
  const ngramCommentIndices = new Map<string, Set<number>>();

  comments.forEach((comment, index) => {
    const normalizedText = comment.text.trim().toLowerCase().replace(/[^\w\s]/g, '');
    const words = normalizedText.split(/\s+/).filter(Boolean);

    if (words.length >= NGRAM_SIZE) {
      for (let i = 0; i <= words.length - NGRAM_SIZE; i++) {
        const ngram = words.slice(i, i + NGRAM_SIZE).join(' ');
        if (!ngramCommentIndices.has(ngram)) {
          ngramCommentIndices.set(ngram, new Set());
        }
        ngramCommentIndices.get(ngram)!.add(index);
      }
    }
  });

  const spamNgrams = new Set<string>();
  ngramCommentIndices.forEach((indices, ngram) => {
    if (indices.size >= NGRAM_SPAM_THRESHOLD) {
      spamNgrams.add(ngram);
    }
  });
  // --- End of duplicate detection logic ---

  return comments.filter(comment => {
    const text = comment.text.trim();
    if (!text) return false;

    // N-gram check for repetitive spam
    const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = normalizedText.split(/\s+/).filter(Boolean);
    if (words.length >= NGRAM_SIZE) {
        for (let i = 0; i <= words.length - NGRAM_SIZE; i++) {
            const ngram = words.slice(i, i + NGRAM_SIZE).join(' ');
            if (spamNgrams.has(ngram)) return false;
        }
    }
    
    const lowerText = text.toLowerCase();
    const spamLinkRegex = /(?:https?:\/\/|www\.)\S+/i;
    const spamPhraseRegex = /check out my channel/i;
    if (spamLinkRegex.test(text) || spamPhraseRegex.test(lowerText)) return false;
    
    const hasSubstantiveContent = /[a-z0-9]/i.test(lowerText);
    if (!hasSubstantiveContent) return false;

    const lowEffortPhrases = new Set(['lol', 'lmao', 'rofl', 'great video', 'nice video', 'first']);
    if (lowEffortPhrases.has(lowerText)) return false;
      
    if (words.length < MIN_WORD_COUNT) return false;

    return true;
  });
};


export const categorizeComments = async (
  comments: Comment[],
  targetLanguage: string,
  onUpdate: (newCategories: Category[], progress: ProgressUpdate) => void
): Promise<AnalysisStats> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing. Please ensure it is configured correctly.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const filteredComments = preFilterComments(comments);

  const stats: AnalysisStats = {
    total: comments.length,
    filtered: comments.length - filteredComments.length,
    analyzed: filteredComments.length,
  };

  if (filteredComments.length === 0) {
    onUpdate([], { processed: 0, total: 0, currentBatch: 0, totalBatches: 0, etaSeconds: 0 });
    return stats;
  }

  const batches: Comment[][] = [];
  for (let i = 0; i < filteredComments.length; i += BATCH_SIZE) {
      batches.push(filteredComments.slice(i, i + BATCH_SIZE));
  }
  const totalBatches = batches.length;
  
  let processedCommentsCount = 0;
  let completedBatches = 0;
  const existingCategoryTitles = new Set<string>();
  const batchProcessingTimes: number[] = [];

  const processBatch = async (batch: Comment[], batchNumber: number): Promise<void> => {
      const batchStartTime = Date.now();
      const prompt = `
        You are an expert at analyzing YouTube comments. Your task is to group the following comments into meaningful categories.

        CRITICAL RULES:
        1.  **Detect Language:** First, identify the dominant language of the comments provided.
        2.  **Translate to Target Language:** Your ENTIRE final JSON response, including all 'categoryTitle' and 'summary' fields, MUST be in the following language: "${targetLanguage}".
        3.  **Categorize:** Group comments into substantive topics. Create concise, descriptive category titles.
        4.  **Summarize:** For each category, provide a one-sentence summary.
        5.  **Filter:** IGNORE spam, bots, generic praise ('nice video'), or low-effort comments. Only categorize substantive discussions.
        6.  **Use Existing Categories:** Before creating a new category, check if a comment fits into one of these already created titles: [${Array.from(existingCategoryTitles).slice(-10).join(', ')}]. This promotes consistency.
        7.  **Include Original IDs:** You MUST include the original 'id' for every comment you categorize.
        
        Here are the comments to analyze:
        ${JSON.stringify(batch)}
      `;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
          },
          safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        });

        const jsonText = response.text.trim();
        const newCategories = JSON.parse(jsonText) as Category[];
        
        newCategories.forEach(cat => {
            if (cat && cat.categoryTitle) {
                existingCategoryTitles.add(cat.categoryTitle);
            }
        });

        // This is a streaming update, sent as soon as one batch is done.
        onUpdate(newCategories, buildProgressUpdate(batch.length));

      } catch (error) {
        console.error(`Error processing batch ${batchNumber}:`, error);
        // Still update progress even if a batch fails, to not stall the progress bar
        buildProgressUpdate(batch.length);
      } finally {
        const batchTime = (Date.now() - batchStartTime) / 1000;
        batchProcessingTimes.push(batchTime);
      }
  };

  const buildProgressUpdate = (processedInBatch: number): ProgressUpdate => {
      processedCommentsCount += processedInBatch;
      completedBatches++;

      let etaSeconds: number | null = null;
      if (batchProcessingTimes.length > 0) {
        const avgTime = batchProcessingTimes.reduce((a, b) => a + b, 0) / batchProcessingTimes.length;
        const batchesRemaining = totalBatches - completedBatches;
        etaSeconds = avgTime * batchesRemaining;
      }
      
      return {
          processed: processedCommentsCount,
          total: filteredComments.length,
          currentBatch: completedBatches,
          totalBatches: totalBatches,
          etaSeconds: etaSeconds,
      };
  };

  // Concurrent worker pool
  const workerPool = async () => {
    const queue = [...batches.entries()]; // [[0, batch1], [1, batch2], ...]
    
    const workers = Array(CONCURRENCY_LIMIT).fill(null).map(async () => {
      while (true) {
        const batchTask = queue.shift();
        if (!batchTask) {
          break; // No more tasks
        }
        const [index, batch] = batchTask;
        await processBatch(batch, index + 1);
      }
    });

    await Promise.all(workers);
  };

  await workerPool();

  if (processedCommentsCount === 0 && filteredComments.length > 0) {
      throw new Error("All comment batches failed to process, possibly due to API content restrictions or network issues.");
  }
  
  return stats;
};
