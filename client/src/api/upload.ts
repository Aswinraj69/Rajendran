import { apiClient } from "./client";

export async function uploadThumbnail(file: File): Promise<{ success: boolean; url: string; filename: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
