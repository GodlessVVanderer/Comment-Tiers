
export interface Comment {
  id: string;
  text: string;
  author: string;
  authorProfileImageUrl: string;
  likeCount: number;
  publishedAt: string;
  replies?: Comment[];
}

export interface Category {
  name: string;
  summary: string;
  comments: Comment[];
}

export interface AnalysisResult {
  categories: {
    name: string;
    summary: string;
    comments: string[];
  }[];
}

export interface AnalysisStats {
  totalCommentsFetched: number;
  totalCommentsAnalyzed: number;
  analysisDurationSeconds: number;
  totalLikesOnAnalyzedComments: number;
  totalRepliesOnAnalyzedComments: number;
}

export type AppStatus = 'idle' | 'fetching' | 'filtering' | 'analyzing' | 'success' | 'error';

export interface Progress {
    processed: number;
    total: number;
}

export interface AppError {
    code: string;
    message: string;
}

export interface TranscriptionTurn {
  speaker: 'user' | 'model';
  text: string;
}
