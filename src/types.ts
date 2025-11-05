export interface UserInfo {
  email: string;
  name: string;
  picture: string;
}

export interface Comment {
  id: string;
  text: string;
}

export interface ThematicGroup {
  theme_title: string;
  summary: string;
  comment_ids: string[];
}

export interface TriageResult {
  passed_ids: string[];
  failed_ids: string[];
  total_processed: number;
}

export interface AnalysisResult {
  triage: TriageResult;
  thematic_groups: ThematicGroup[];
}
