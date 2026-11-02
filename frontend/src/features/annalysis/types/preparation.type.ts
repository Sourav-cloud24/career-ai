export type PreparationPlanPriority = "high" | "medium" | "low";

export interface PreparationPlanDay {
  dayNumber: number;
  topic: string;
  priority: PreparationPlanPriority;
  learningGoal: string;
  tasks: string[];
  estimatedMinutes: number;
  deliverable: string;
}

export interface PreparationPlanWeek {
  weekNumber: number;
  title: string;
  goal: string;
  days: PreparationPlanDay[];
}

export interface PreparationPlan {
  overview: string;
  durationWeeks: number;
  weeks: PreparationPlanWeek[];
}

export interface PreparationPlanData {
  id: number;
  analysis_id: number;
  user_id: number;
  title: string;
  plan: PreparationPlan;
  created_at: string;
  updated_at: string;
}

export interface PreparationPlanResponse {
  success: boolean;
  message: string;
  data: PreparationPlanData;
}