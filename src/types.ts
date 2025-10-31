// This is a placeholder for types.ts
// In a real application, you would define your types here.
// For example:
// export interface YouTubeComment { ... }

export interface YouTubeComment {
  id: string;
  author: string;
  authorProfileImageUrl: string;
  text: string;
  publishedAt: string;
  likeCount: number;
  replyCount: number;
}

export interface Comment extends YouTubeComment {
  replies?: Comment[];
  timestamp?: number;
  isEditable?: boolean;
}

export interface Category {
  name: string;
  icon: string;
  prompt: string;
  comments: Comment[];
}

export interface AnalysisStats {
  totalComments: number;
  filteredComments: number;
  analyzedComments: number;
}

export interface AnalysisResult {
  summary: string;
  stats: AnalysisStats;
  categories: Category[];
  topComments: Comment[];
}

export interface ProgressUpdate {
  percentage: number;
  batch?: number;
  totalBatches?: number;
  etaSeconds?: number;
  eta?: string;
}

export type AppStatus = 'idle' | 'configuring' | 'fetching' | 'filtering' | 'analyzing' | 'error' | 'success';

export type View = 'stats' | 'comments' | 'live';

export interface TranscriptionEntry {
  speaker: 'user' | 'model';
  text: string;
}

export interface AppError {
  code: string;
  message: string;
}
