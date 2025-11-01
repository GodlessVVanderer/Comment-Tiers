export const COMMENT_LIMIT_OPTIONS = [1000, 2000, 5000, 10000];
export const DEFAULT_COMMENT_LIMIT = 2000;

// FIX: Add missing constant exports
export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
export const CONCURRENCY_LIMIT = 5;

export const COMMENT_CATEGORIES = [
    { name: 'Questions', description: 'Comments asking questions about the video content.' },
    { name: 'Feedback & Suggestions', description: 'Comments providing feedback or suggesting improvements.' },
    { name: 'Positive Sentiment', description: 'Comments expressing enjoyment, appreciation, or agreement.' },
    { name: 'Negative Sentiment', description: 'Comments expressing criticism, disagreement, or disappointment.' },
    { name: 'General Discussion', description: 'Comments discussing the video topic without strong sentiment.' },
    { name: 'Off-Topic', description: 'Comments that are not related to the video.' },
];