export interface Comment {
  id: string;
  author: string;
  text: string;
  likeCount: number;
  publishedAt: string;
  authorProfileImageUrl: string;
  replies: Comment[];
  totalReplyCount: number;
  isRepliesLoading?: boolean;
  nextReplyPageToken?: string | null;
  isEditable?: boolean;
  timestamp?: number;
}

export type Category<T = Comment> = {
  category: string;
  summary: string;
  comments: T[];
};

export interface AnalysisStats {
  totalComments: number;
  filteredComments: number;
  analyzedComments: number;
}

export interface AnalysisResults {
  stats: AnalysisStats;
  categories: Category[];
}

export type AppStatus = 'idle' | 'loading' | 'summarizing' | 'error' | 'success' | 'configuring';

export type LoadingPhase = 'fetching' | 'filtering' | 'analyzing' | 'summarizing';

export interface ProgressUpdate {
  phase: LoadingPhase;
  percent: number;
  etaSeconds?: number;
  processed?: number;
  total?: number;
}

export interface AppError {
  code: string;
  message: string;
}

export interface TranscriptionTurn {
  speaker: 'user' | 'model';
  text: string;
}

export type LiveSessionStatus = 'idle' | 'listening' | 'processing' | 'speaking';

export interface LiveSessionState {
  status: LiveSessionStatus;
  transcription: TranscriptionTurn[];
  error: string | null;
}
