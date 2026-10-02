import { apiClient } from "./client";
import { AdminUser } from "../types";

export async function login(email: string, password: string): Promise<AdminUser> {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function fetchCurrentUser(): Promise<AdminUser | null> {
  try {
    const { data } = await apiClient.get("/auth/me");
    return data.data;
  } catch {
    return null;
  }
}
