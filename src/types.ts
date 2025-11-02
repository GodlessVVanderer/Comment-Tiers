export interface Comment {
    id: string;
    text: string;
    author: string;
    authorProfileImageUrl: string;
    publishedAt: string;
    likeCount: number;
    replyCount: number;
}

export interface VideoDetails {
    title: string;
    author: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
}

export interface AnalysisCategory {
    name: string;
    comments: Comment[];
    summary?: string;
}

export interface AnalysisResult {
    summary: string;
    sentiment: {
        positive: number;
        negative: number;
        neutral: number;
    };
    categories: AnalysisCategory[];
    topics: string[];
    stats: {
        totalComments: number;
        commentsAnalyzed: number;
    };
}

export type AppStatus = 'idle' | 'loading' | 'success' | 'error' | 'config_error' | 'unauthenticated';
