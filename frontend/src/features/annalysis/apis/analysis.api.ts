import apiClient from "@/lib/apiClient";
import { AnalysisDetailResponse, AnalysisHistoryResponse } from "../types/analysis.type";

type CreateAnalysisPayload = {
  resumeId: number;
  jobDescriptionId: number;
};

export const analysisApi = {
  createAnalysis: async ({
    resumeId,
    jobDescriptionId,
  }: CreateAnalysisPayload) => {
    const response = await apiClient.post("/analysis", {
      resumeId,
      jobDescriptionId,
    });

    return response.data;
  },
  getAllAnalysis: async (): Promise<AnalysisHistoryResponse> => {
    const response = await apiClient.get<AnalysisHistoryResponse>("/analysis");
    
    return response.data;
  },

  getAllAnalysisById: async (analysisId: number): Promise<AnalysisDetailResponse> => {
    const response = await apiClient.get<AnalysisDetailResponse>(`/analysis/${analysisId}`);

    return response.data;
  },
};
