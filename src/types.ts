export interface Comment {
  id: string;
  author: string;
  text: string;
  replies?: Comment[];
  timestamp?: number;
  isEditable?: boolean;
}

export interface Category {
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