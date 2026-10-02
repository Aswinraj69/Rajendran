import { apiClient } from "./client";
import { AudioTrack, Pagination } from "../types";

export interface ListAudioParams {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
  featured?: boolean;
}

export interface ListAudioResponse {
  success: boolean;
  data: AudioTrack[];
  pagination: Pagination;
}

export async function listAudio(params: ListAudioParams = {}): Promise<ListAudioResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.category) query.append("category", params.category);
  if (params.q) query.append("q", params.q);
  if (params.featured) query.append("featured", "true");

  const res = await apiClient.get(`/audio?${query.toString()}`);
  return res.data;
}

export async function getAudio(id: string): Promise<{ success: boolean; data: AudioTrack }> {
  const res = await apiClient.get(`/audio/${id}`);
  return res.data;
}

export async function incrementAudioPlays(id: string): Promise<{ success: boolean; playsCount: number }> {
  const res = await apiClient.post(`/audio/${id}/play`);
  return res.data;
}

export async function likeAudioTrack(
  id: string,
  action: "like" | "unlike" = "like"
): Promise<{ success: boolean; likesCount: number; action: string }> {
  const res = await apiClient.post(`/audio/${id}/like`, { action });
  return res.data;
}

export async function createAudioTrack(
  data: Partial<AudioTrack>
): Promise<{ success: boolean; data: AudioTrack }> {
  const res = await apiClient.post("/audio/admin", data);
  return res.data;
}

export async function updateAudioTrack(
  id: string,
  data: Partial<AudioTrack>
): Promise<{ success: boolean; data: AudioTrack }> {
  const res = await apiClient.put(`/audio/admin/${id}`, data);
  return res.data;
}

export async function deleteAudioTrack(id: string): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete(`/audio/admin/${id}`);
  return res.data;
}

export async function uploadAudioFile(file: File): Promise<{ success: boolean; url: string; filename: string }> {
  const formData = new FormData();
  formData.append("audio", file);
  const res = await apiClient.post("/upload/audio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
