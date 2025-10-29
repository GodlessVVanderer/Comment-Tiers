
export interface AppError {
  code: string;
  message: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  replies?: Comment[];
}

export interface Category {
  id: string; // CRITICAL FIX: Add a unique ID to prevent rendering crashes.
  categoryTitle: string;
  summary: string;
  comments: Comment[];
}

export interface AnalysisStats {
  total: number;
  filtered: number;
  analyzed: number;
}

export interface ProgressUpdate {
  processed: number;
  total: number;
  currentBatch: number;
  totalBatches: number;
  etaSeconds: number | null;
}
