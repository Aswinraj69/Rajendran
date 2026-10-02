import { apiClient } from "./client";
import { Pagination, Story } from "../types";

export interface StoryListParams {
  page?: number;
  category?: string;
  q?: string;
  featured?: boolean;
}

export async function listStories(
  params: StoryListParams = {}
): Promise<{ data: Story[]; pagination: Pagination }> {
  const { data } = await apiClient.get("/stories", { params });
  return data;
}

export async function getStoryBySlug(
  slug: string
): Promise<{ data: Story; related: Story[] }> {
  const { data } = await apiClient.get(`/stories/slug/${slug}`);
  return data;
}

// --- Admin ---

export async function listAdminStories(
  params: { page?: number; status?: string; q?: string } = {}
): Promise<{ data: Story[]; pagination: Pagination }> {
  const { data } = await apiClient.get("/stories/admin/all", { params });
  return data;
}

export async function getAdminStory(id: string): Promise<Story> {
  const { data } = await apiClient.get(`/stories/admin/${id}`);
  return data.data;
}

export async function createStory(payload: Partial<Story>): Promise<Story> {
  const { data } = await apiClient.post("/stories/admin", payload);
  return data.data;
}

export async function updateStory(id: string, payload: Partial<Story>): Promise<Story> {
  const { data } = await apiClient.put(`/stories/admin/${id}`, payload);
  return data.data;
}

export async function deleteStory(id: string): Promise<void> {
  await apiClient.delete(`/stories/admin/${id}`);
}
