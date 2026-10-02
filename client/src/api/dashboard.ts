import { apiClient } from "./client";
import { DashboardSummary } from "../types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get("/dashboard/summary");
  return data.data;
}
