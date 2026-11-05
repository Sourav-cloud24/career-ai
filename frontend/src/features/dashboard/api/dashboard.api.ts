
import apiClient from "@/lib/apiClient";
import { DashboardApiResponse, DashboardOverview } from "../types/dashboard.types";


export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await apiClient.get<DashboardApiResponse>(
    "/dashboard/overview"
  );

  return response.data.data;
};
