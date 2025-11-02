
// Fix: Add Chrome types reference to resolve 'Cannot find name chrome' error.
/// <reference types="chrome" />
import { GoogleGenAI, Type } from "@google/genai";
import { Comment, AnalysisResult } from "../types";
import { GEMINI_MODEL } from "../constants";

async function getApiKey(): Promise<string> {
    const result = await chrome.storage.local.get("geminiApiKey");
    const apiKey = result.geminiApiKey;
    if (!apiKey) {
        throw new Error("Gemini API key not found. Please set it in the options page.");
    }
    return apiKey;
}

const getClient = async () => {
    const apiKey = await getApiKey();
    return new GoogleGenAI({ apiKey });
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A high-level summary of all comments provided.",
        },
        sentiment: {
            type: Type.OBJECT,
            properties: {
                positive: {
                    type: Type.NUMBER,
                    description: "Percentage of positive comments (0-100).",
                },
                negative: {
                    type: Type.NUMBER,
                    description: "Percentage of negative comments (0-100).",
                },
                neutral: {
                    type: Type.NUMBER,
                    description: "Percentage of neutral comments (0-100).",
                },
            },
            required: ["positive", "negative", "neutral"],
        },
        categories: {
            type: Type.ARRAY,
            description: "An array of comment categories.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the category (e.g., 'Questions', 'Feedback', 'Spam')." },
                    summary: { type: Type.STRING, description: "A brief summary of the comments in this category." },
                    comment_ids: {
                        type: Type.ARRAY,
                        description: "An array of comment IDs that belong to this category.",
                        items: { type: Type.STRING },
                    },
                },
                required: ["name", "summary", "comment_ids"],
            },
        },
    },
    required: ["summary", "sentiment", "categories"],
};


export async function analyzeCommentsWithGemini(comments: Comment[]): Promise<AnalysisResult> {
    const ai = await getClient();
    const commentData = comments.map(c => ({ id: c.id, text: c.text }));

    const prompt = `Analyze the following YouTube comments and provide a detailed breakdown.
    
    Comments (JSON format):
    ${JSON.stringify(commentData.slice(0, 200))} // Limit comments to avoid hitting token limits

    Please perform the following analysis:
    1.  **Overall Summary**: Write a concise, high-level summary of the general sentiment and key themes across all comments.
    2.  **Sentiment Analysis**: Calculate the percentage of positive, negative, and neutral comments. The sum should be 100.
    3.  **Categorization**: Group the comments into 3-5 relevant categories (e.g., "Questions", "Feature Requests", "Positive Feedback", "Bug Reports", "General Discussion"). For each category, provide a short summary and a list of the comment IDs that fall into it.

    Return the entire analysis in a single JSON object matching the provided schema.`;

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    const commentMap = new Map(comments.map(c => [c.id, c]));

    const result: AnalysisResult = {
        summary: parsed.summary,
        sentiment: parsed.sentiment,
        categories: parsed.categories.map((cat: any) => ({
            name: cat.name,
            summary: cat.summary,
            comments: (cat.comment_ids || []).map((id: string) => commentMap.get(id)).filter(Boolean) as Comment[],
        })),
        topics: [],
        stats: {
            totalComments: comments.length,
            commentsAnalyzed: commentData.length,
        },
    };

    return result;
}