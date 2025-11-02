export interface Comment {
    id: string;
    text: string;
    author: string;
    authorProfileImageUrl: string;
    authorChannelUrl: string;
    likeCount: number;
    publishedAt: string;
    replies?: Comment[];
}

export interface Topic {
    title: string;
    summary: string;
    comments: Comment[];
}

export interface AnalysisResult {
    topics: Topic[];
    sentiment: {
        positive: number;
        negative: number;
        neutral: number;
    };
    summary: string;
}

export interface VideoDetails {
    id: string;
    title: string;
    author: string;
    thumbnailUrl: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
}

export type AppStatus = 'idle' | 'loading' | 'success' | 'error' | 'config-error';

export type AuthStatus = 'unauthenticated' | 'loading' | 'authenticated' | 'error';

export interface AuthState {
    status: AuthStatus;
    token: string | null;
    error: string | null;
}
