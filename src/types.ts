// FIX: Define all necessary types for the application

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorProfileImageUrl: string;
  authorChannelUrl?: string;
  authorChannelId?: string;
  publishedAt: string;
  likeCount: number;
  replies: Comment[];
  totalReplyCount: number;
  isEditable?: boolean;
  isRepliesLoading?: boolean;
  nextPageToken?: string;
}

export interface Category {
  category: string;
  summary: string;
  comments: Comment[];
}

export interface AnalysisStats {
  totalComments: number;
  filteredComments: number;
  analyzedComments: number;
}

export interface AnalysisResults {
  stats: AnalysisStats;
  categories: Category[];
}

export type AppStatus = 'idle' | 'loading' | 'results' | 'error' | 'config-error' | 'configuring';
export type ProgressPhase = 'fetching' | 'filtering' | 'analyzing' | 'summarizing';

export interface Progress {
  phase: ProgressPhase;
  percent: number;
  processed?: number;
  total?: number;
  etaSeconds?: number;
}

export interface AppError {
  code: string;
  message: string;
}

export type LiveSessionStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'loading';
export interface TranscriptionTurn {
  speaker: 'user' | 'model';
  text: string;
}
export interface LiveSessionState {
  status: LiveSessionStatus;
  transcription: TranscriptionTurn[];
  error: string | null;
}