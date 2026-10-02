import { apiClient } from "./client";
import { Pagination, Video } from "../types";

export async function listVideos(
  params: { page?: number; limit?: number; category?: string; featured?: boolean } = {}
): Promise<{ data: Video[]; pagination: Pagination }> {
  const { data } = await apiClient.get("/videos", { params });
  return data;
}

export async function getVideoById(id: string): Promise<Video> {
  const { data } = await apiClient.get(`/videos/${id}`);
  return data.data;
}

// --- Admin ---

export async function listAdminVideos(
  params: { page?: number; q?: string } = {}
): Promise<{ data: Video[]; pagination: Pagination }> {
  const { data } = await apiClient.get("/videos/admin/all", { params });
  return data;
}

export async function createVideo(payload: Partial<Video>): Promise<Video> {
  const { data } = await apiClient.post("/videos/admin", payload);
  return data.data;
}

export async function updateVideo(id: string, payload: Partial<Video>): Promise<Video> {
  const { data } = await apiClient.put(`/videos/admin/${id}`, payload);
  return data.data;
}

export async function deleteVideo(id: string): Promise<void> {
  await apiClient.delete(`/videos/admin/${id}`);
}
