import { apiClient } from "./client";

export interface SiteContentEntry {
  key: string;
  value: string;
  section?: string;
}

export async function fetchSiteContent(): Promise<{
  data: Record<string, string>;
  list: SiteContentEntry[];
}> {
  const res = await apiClient.get("/site-content");
  return res.data;
}

export async function updateSiteContent(
  entries: SiteContentEntry[]
): Promise<Record<string, string>> {
  const res = await apiClient.put("/site-content", { entries });
  return res.data.data;
}

export async function deleteSiteContent(key: string): Promise<void> {
  await apiClient.delete(`/site-content/${encodeURIComponent(key)}`);
}
