import { apiClient } from "./client";
import { Pagination, YouTubePost } from "../types";

export async function listYouTubePosts(
  params: { page?: number; limit?: number } = {}
): Promise<{ data: YouTubePost[]; pagination: Pagination }> {
  const { data } = await apiClient.get("/youtube/posts", { params });
  return data;
}

export async function syncYouTubeChannel(): Promise<{
  success: boolean;
  message: string;
  syncedCount: number;
}> {
  const { data } = await apiClient.post("/youtube/sync");
  return data;
}

export async function createYouTubePost(
  payload: Partial<YouTubePost>
): Promise<YouTubePost> {
  const { data } = await apiClient.post("/youtube/posts/admin", payload);
  return data.data;
}

export async function updateYouTubePost(
  id: string,
  payload: Partial<YouTubePost>
): Promise<YouTubePost> {
  const { data } = await apiClient.put(`/youtube/posts/admin/${id}`, payload);
  return data.data;
}

export async function deleteYouTubePost(id: string): Promise<void> {
  await apiClient.delete(`/youtube/posts/admin/${id}`);
}
