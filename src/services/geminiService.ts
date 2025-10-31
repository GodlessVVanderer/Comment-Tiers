import { GoogleGenAI, Type } from "@google/genai";
import { Comment, AnalysisResults, CommentCategory } from '../types';
import { GEMINI_MODEL } from '../constants';

export async function analyzeComments(comments: Comment[], apiKey: string): Promise<AnalysisResults> {
  // Fix: Correctly initialize GoogleGenAI with a named apiKey object.
  const ai = new GoogleGenAI({apiKey});

  const prompt = `
    Analyze the following YouTube comments for the video. Your task is to provide a comprehensive analysis.

    1.  **Overall Summary**: Write a brief, neutral summary of the general sentiment and main topics discussed in the comments.
    2.  **Categorization**: Group the comments into relevant categories such as "Questions", "Positive Feedback", "Negative Feedback", "Suggestions", and "Off-topic/Spam". For each category, provide a short summary and include the original comments that fall into that category. Pass through all original comment fields.
    3.  **Sentiment Analysis**: Calculate the overall sentiment distribution as percentages for positive, negative, and neutral comments. The total should add up to 100.

    Here are the comments:
    ${JSON.stringify(comments)}
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A general summary of all comments."
      },
      categories: {
        type: Type.ARRAY,
        description: "Categorized comments.",
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "e.g., 'Positive Feedback', 'Questions', etc." },
            summary: { type: Type.STRING, description: "A summary for this category." },
            comments: {
              type: Type.ARRAY,
              description: "The comments belonging to this category.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  author: { type: Type.STRING },
                  text: { type: Type.STRING },
                  likeCount: { type: Type.INTEGER },
                  publishedAt: { type: Type.STRING },
                  authorProfileImageUrl: { type: Type.STRING },
                },
                required: ["id", "author", "text", "likeCount", "publishedAt", "authorProfileImageUrl"],
              }
            }
          },
          required: ["category", "summary", "comments"],
        }
      },
      sentiment: {
        type: Type.OBJECT,
        description: "Overall sentiment analysis as percentages.",
        properties: {
          positive: { type: Type.NUMBER, description: "Percentage of positive comments (0-100)." },
          negative: { type: Type.NUMBER, description: "Percentage of negative comments (0-100)." },
          neutral: { type: Type.NUMBER, description: "Percentage of neutral comments (0-100)." },
        },
        required: ["positive", "negative", "neutral"],
      }
    },
    required: ["summary", "categories", "sentiment"],
  };

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2,
    },
  });

  try {
    const text = response.text.trim();
    const parsedJson = JSON.parse(text);

    const commentsById = new Map(comments.map(c => [c.id, c]));
    
    parsedJson.categories.forEach((category: CommentCategory) => {
        category.comments = category.comments
            .map((comment: any) => commentsById.get(comment.id))
            .filter((c): c is Comment => c !== undefined);
    });

    return parsedJson as AnalysisResults;
  } catch (e) {
    console.error("Failed to parse Gemini response:", e, "Raw response:", response.text);
    throw new Error("Could not parse the analysis from the AI. The response might be malformed.");
  }
}
