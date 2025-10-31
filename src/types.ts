export interface Comment {
  id: string;
  author: string;
  text: string;
  likeCount: number;
  publishedAt: string;
  authorProfileImageUrl: string;
}

export interface CommentCategory {
  category: string;
  comments: Comment[];
  summary: string;
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
}

export interface AnalysisResults {
  summary: string;
  categories: CommentCategory[];
  sentiment: SentimentStats;
}
