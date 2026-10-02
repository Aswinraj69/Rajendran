import { apiClient } from "./client";
import { Comment } from "../types";

export interface LikeResponse {
  success: boolean;
  likesCount: number;
  action: "liked" | "unliked";
}

export interface ShareResponse {
  success: boolean;
  sharesCount: number;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
  total: number;
}

export interface AdminCommentsResponse {
  success: boolean;
  data: Comment[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export async function likeStory(
  idOrSlug: string,
  action: "like" | "unlike" = "like"
): Promise<LikeResponse> {
  const res = await apiClient.post(`/stories/${idOrSlug}/like`, { action });
  return res.data;
}

export async function shareStory(idOrSlug: string): Promise<ShareResponse> {
  const res = await apiClient.post(`/stories/${idOrSlug}/share`);
  return res.data;
}

export async function getStoryComments(idOrSlug: string): Promise<CommentsResponse> {
  const res = await apiClient.get(`/stories/${idOrSlug}/comments`);
  return res.data;
}

export async function addStoryComment(
  idOrSlug: string,
  data: { authorName: string; authorEmail?: string; content: string }
): Promise<{ success: boolean; data: Comment; commentsCount: number }> {
  const res = await apiClient.post(`/stories/${idOrSlug}/comments`, data);
  return res.data;
}

export async function listAllComments(page = 1, limit = 50): Promise<AdminCommentsResponse> {
  const res = await apiClient.get(`/admin/comments?page=${page}&limit=${limit}`);
  return res.data;
}

export async function deleteComment(id: string): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete(`/admin/comments/${id}`);
  return res.data;
}
