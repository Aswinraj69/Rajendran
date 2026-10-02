import { apiClient } from "./client";
import { ContactMessage } from "../types";

export interface SendContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessagesResponse {
  data: ContactMessage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    unreadCount: number;
  };
}

export async function sendContactMessage(
  payload: SendContactPayload
): Promise<{ success: boolean; data: ContactMessage; message: string }> {
  const { data } = await apiClient.post("/contact", payload);
  return data;
}

// --- Admin ---

export async function listContactMessages(params: {
  page?: number;
  limit?: number;
  read?: boolean;
} = {}): Promise<ContactMessagesResponse> {
  const { data } = await apiClient.get("/contact", { params });
  return data;
}

export async function toggleContactMessageRead(
  id: string,
  read?: boolean
): Promise<{ success: boolean; data: ContactMessage }> {
  const { data } = await apiClient.patch(`/contact/${id}/read`, { read });
  return data;
}

export async function deleteContactMessage(
  id: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.delete(`/contact/${id}`);
  return data;
}
