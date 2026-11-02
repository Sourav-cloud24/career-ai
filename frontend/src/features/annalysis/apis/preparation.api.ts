import apiClient from "@/lib/apiClient";
import { PreparationPlanResponse } from "../types/preparation.type";

export const preparationApi = {
  createPreparationPlan: async (
    analysisId: number,
  ): Promise<PreparationPlanResponse> => {
    const response = await apiClient.post<PreparationPlanResponse>(
      `/preparation-plans/${analysisId}`,
    );

    return response.data;
  },

  getPreparationPlanByAnalysisId: async (
    analysisId: number,
  ): Promise<PreparationPlanResponse> => {
    const response = await apiClient.get<PreparationPlanResponse>(
      `/preparation-plans/${analysisId}`,
    );

    return response.data;
  },
};
