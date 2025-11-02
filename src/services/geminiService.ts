import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, Comment } from '../types';

const getResponseSchema = () => ({
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A high-level summary of all the comments provided."
        },
        sentiment: {
            type: Type.OBJECT,
            properties: {
                positive: { type: Type.NUMBER, description: "Percentage of positive comments (0-100)." },
                negative: { type: Type.NUMBER, description: "Percentage of negative comments (0-100)." },
                neutral: { type: Type.NUMBER, description: "Percentage of neutral comments (0-100)." },
            },
            required: ["positive", "negative", "neutral"]
        },
        topics: {
            type: Type.ARRAY,
            description: "A list of key topics or themes discovered in the comments.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A short, descriptive title for the topic (e.g., 'Feature Requests', 'Positive Feedback')." },
                    summary: { type: Type.STRING, description: "A one-sentence summary of the comments in this topic." },
                    comment_ids: {
                        type: Type.ARRAY,
                        description: "A list of comment IDs that belong to this topic.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["title", "summary", "comment_ids"]
            }
        }
    },
    required: ["summary", "sentiment", "topics"]
});

export const analyzeComments = async (comments: Comment[]): Promise<AnalysisResult> => {
    if (!comments || comments.length === 0) {
        return {
            summary: "No comments to analyze.",
            sentiment: { positive: 0, negative: 0, neutral: 0 },
            topics: [],
        };
    }
    
    // FIX: Initialize GoogleGenAI with API key from process.env per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const commentsText = comments.map(c => `Comment ID: ${c.id}\nText: ${c.text}`).join('\n\n');

    const prompt = `
        Analyze the following YouTube comments and provide a detailed summary. I need the output in JSON format.
        
        Here is the data:
        ${commentsText}

        Please perform the following analysis:
        1.  **Overall Summary:** A high-level summary of all the comments provided.
        2.  **Sentiment Analysis:** Calculate the percentage of positive, negative, and neutral comments.
        3.  **Topic Modeling:** Identify the main topics or themes being discussed. For each topic, provide a title, a one-sentence summary, and a list of the corresponding comment IDs. Create between 3 to 7 topics.
    `;

    try {
        const response = await ai.models.generateContent({
            // FIX: Use appropriate model for complex text tasks
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: getResponseSchema(),
            },
        });

        // FIX: Extract text using .text property
        const jsonString = response.text.trim();
        const analysis = JSON.parse(jsonString);

        // Map comment IDs back to full comment objects
        const commentMap = new Map(comments.map(c => [c.id, c]));
        const result: AnalysisResult = {
            summary: analysis.summary,
            sentiment: analysis.sentiment,
            topics: analysis.topics.map((topic: any) => ({
                title: topic.title,
                summary: topic.summary,
                comments: topic.comment_ids
                    .map((id: string) => commentMap.get(id))
                    .filter((c: Comment | undefined): c is Comment => c !== undefined),
            })),
        };

        return result;
    } catch (error) {
        console.error("Error analyzing comments with Gemini:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the response from the AI model. It was not valid JSON.");
        }
        throw new Error("Failed to analyze comments due to an API error.");
    }
};
