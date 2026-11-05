
export interface DashboardStats {
  totalResumes: number;
  totalJobDescriptions: number;
  totalAnalyses: number;
  completedAnalyses: number;
}

export interface RecentAnalysis {
  id: number;
  status: string;
  summary: string | null;
  created_at: string;
  completed_at: string | null;
  resume_name: string | null;
  job_title: string | null;
  company_name: string | null;
}

export interface LatestAnalysis extends RecentAnalysis {
  result: Record<string, unknown>;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentAnalyses: RecentAnalysis[];
  latestAnalysis: LatestAnalysis | null;
  latestPreparationPlan: null;
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardOverview;
}
