import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Type } from "@google/genai";
// Fix: Removed CONCURRENCY_LIMIT as it is not exported from constants.ts and not used in this file.
import { COMMENT_CATEGORIES } from '../constants';
import { Comment, AnalysisResults, CommentCategory } from '../types';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'A brief, one-sentence summary of the overall tone of the comments provided.',
    },
    sentiment: {
      type: Type.OBJECT,
      properties: {
        positive: { type: Type.NUMBER, description: 'Percentage of comments that are positive (0-100)' },
        negative: { type: Type.NUMBER, description: 'Percentage of comments that are negative (0-100)' },
        neutral: { type: Type.NUMBER, description: 'Percentage of comments that are neutral (0-100)' },
      },
      required: ['positive', 'negative', 'neutral'],
    },
    categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: `The name of the category. Must be one of: ${COMMENT_CATEGORIES.map(c => c.name).join(', ')}`,
          },
          comments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: 'The unique ID of the comment.' },
                text: { type: Type.STRING, description: 'The full text of the comment.' },
              },
              required: ['id', 'text'],
            },
          },
          summary: {
            type: Type.STRING,
            description: 'A one-sentence summary of the comments in this category.',
          },
        },
        required: ['category', 'comments', 'summary'],
      },
    },
  },
  required: ['summary', 'sentiment', 'categories'],
};


const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export async function analyzeComments(
  comments: Comment[],
  geminiApiKey: string,
): Promise<AnalysisResults> {
  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
  const prompt = `
    Analyze the following YouTube comments. Provide a main summary, sentiment analysis (positive, negative, neutral percentages), and categorize the comments into the following groups: ${COMMENT_CATEGORIES.map(c => c.name).join(', ')}.
    
    For each category, provide a one-sentence summary and a list of the comments that fit into it, including their original ID and text.
    
    Here are the comments:
    ${JSON.stringify(comments.map(c => ({ id: c.id, text: c.text })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      // Fix: Moved safetySettings into the config object to align with the GenerateContentParameters type.
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        safetySettings,
      },
    });

    const jsonString = response.text?.trim() ?? '';
    if (!jsonString) {
      throw new Error('Gemini API returned an empty response.');
    }
    
    const parsed = JSON.parse(jsonString);

    // Map the comment IDs from the result back to the full comment objects
    const categorizedComments = parsed.categories.map((category: any) => {
        const fullComments = category.comments.map((comment: any) => {
            return comments.find(c => c.id === comment.id);
        }).filter(Boolean); // Filter out any undefined if a comment ID was not found

        return {
            ...category,
            comments: fullComments,
        };
    });

    return {
        ...parsed,
        categories: categorizedComments,
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error('GEMINI_INVALID_KEY');
    }
    throw new Error('Failed to analyze comments with Gemini.');
  }
}
