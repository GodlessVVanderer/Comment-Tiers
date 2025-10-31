// FIX: Implement Gemini service for comment analysis and summarization.
import { GoogleGenAI, Type } from "@google/genai";
import { COMMENT_CATEGORIES } from "../constants";
import { Category, Comment } from "../types";

// FIX: Create a custom error class to handle specific error codes and causes.
class GeminiServiceError extends Error {
    cause: string;

    constructor(message: string, cause: string) {
        super(message);
        this.name = 'GeminiServiceError';
        this.cause = cause;
    }
}

const analysisSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        enum: COMMENT_CATEGORIES.map(c => c.name),
      },
      comment_ids: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
      },
    },
    required: ["category", "comment_ids"],
  },
};

const summarySchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A concise summary of the provided comments in 2-3 sentences."
        }
    },
    required: ["summary"],
};

export const analyzeCommentBatch = async (
  apiKey: string,
  comments: Comment[]
): Promise<Array<{ category: string; comment_ids: string[] }>> => {
  // NOTE: In a browser extension context, API keys are managed by the user
  // and passed from secure storage, rather than using process.env.
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Analyze and categorize the following YouTube comments. The ID of each comment is prefixed. Your response must be a valid JSON array matching the provided schema.

Categories:
${COMMENT_CATEGORIES.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Comments:
${comments.map(c => `${c.id}:::${c.author}:::${c.text}`).join('\n\n')}
`;

  try {
    // FIX: Use ai.models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    // FIX: Access text directly from response and handle potential undefined value
    const jsonString = response.text;
    if (typeof jsonString !== 'string') {
      throw new GeminiServiceError("Received empty or invalid response from Gemini.", 'GEMINI_API_FAILURE');
    }
    const result = JSON.parse(jsonString);
    return result as Array<{ category: string; comment_ids: string[] }>;
  } catch (error) {
    console.error("Error analyzing comment batch:", error);

    if (error instanceof SyntaxError) {
        throw new GeminiServiceError("Failed to parse response from Gemini.", 'GEMINI_API_FAILURE');
    }
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new GeminiServiceError("Invalid Gemini API key.", 'GEMINI_API_KEY');
    }
    if (error instanceof GeminiServiceError) {
        throw error;
    }
    throw new GeminiServiceError("Failed to analyze comments with Gemini.", 'GEMINI_API_FAILURE');
  }
};

export const summarizeCategory = async (
  apiKey: string,
  category: Category
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  const commentsText = category.comments.slice(0, 20).map(c => `- ${c.text}`).join('\n');

  const prompt = `Summarize the following comments from the "${category.category}" category in 2-3 sentences. Focus on the main themes and sentiments expressed by the commenters.

Comments:
${commentsText}
`;

  try {
    // FIX: Use ai.models.generateContent for summarization
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: summarySchema,
      }
    });
    
    // FIX: Access text directly from response and handle potential undefined value
    const jsonString = response.text;
    if (typeof jsonString !== 'string') {
        throw new GeminiServiceError(`Received empty summary response for category "${category.category}".`, 'GEMINI_API_FAILURE');
    }
    const result: { summary: string } = JSON.parse(jsonString);
    return result.summary;

  } catch (error) {
    console.error(`Error summarizing category ${category.category}:`, error);
    
    if (error instanceof SyntaxError) {
        throw new GeminiServiceError(`Failed to parse summary for category "${category.category}".`, 'GEMINI_API_FAILURE');
    }
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new GeminiServiceError("Invalid Gemini API key.", 'GEMINI_API_KEY');
    }
    if (error instanceof GeminiServiceError) {
        throw error;
    }
    throw new GeminiServiceError(`Failed to summarize category "${category.category}".`, 'GEMINI_API_FAILURE');
  }
};