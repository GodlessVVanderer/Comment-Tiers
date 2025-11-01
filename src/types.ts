export interface YouTubeComment {
  id: string;
  text: string;
  author: string;
  authorProfileImageUrl: string;
  likeCount: number;
  replyCount: number;
  publishedAt: string;
}

export interface CommentCategory {
  name: string;
  description: string;
  comments: YouTubeComment[];
  count: number;
}

export interface AnalysisResult {
  totalComments: number;
  analyzedComments: number;
  categories: CommentCategory[];
}

export interface AnalysisStats {
  totalComments: number;
  analyzedComments: number;
  questions: number;
  feedback: number;
  positive: number;
  negative: number;
}

export type AppStatus = 'idle' | 'loading' | 'error' | 'results' | 'config-error';

export interface Progress {
  value: number;
  text: string;
  eta?: number;
}

// For live conversation feature
export type LiveSessionStatus = 'idle' | 'loading' | 'listening' | 'processing' | 'speaking';

export interface TranscriptionTurn {
  speaker: 'user' | 'model';
  text: string;
  isFinal?: boolean;
}
