export type AnalysisHistoryItem = {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  summary: string;
  created_at: string;
  completed_at: string | null;
  resume_name: string;
  job_title: string;
  company_name: string | null;
};

export type AnalysisHistoryResponse = {
  success: boolean;
  data: AnalysisHistoryItem[];
};

export type AnalysisSkillEvidence = {
  skill: string;
  evidence: string;
};

export type AnalysisMissingSkill = {
  skill: string;
  reason: string;
  importance: "high" | "medium" | "low";
};

export type AnalysisPartialSkill = {
  skill: string;
  reason: string;
};

export type AnalysisResult = {
  summary: string;
  matchedSkills: AnalysisSkillEvidence[];
  missingSkills: AnalysisMissingSkill[];
  partialSkills: AnalysisPartialSkill[];
  recommendations: string[];
};

export type AnalysisDetail = {
  id: string;
  user_id: string;
  resume_id: string;
  job_description_id: string;
  status: "pending" | "running" | "completed" | "failed";
  summary: string;
  result: AnalysisResult;
  model: string;
  prompt_version: string;
  created_at: string;
  completed_at: string | null;
};

export type AnalysisDetailResponse = {
  success: boolean;
  data: AnalysisDetail;
};