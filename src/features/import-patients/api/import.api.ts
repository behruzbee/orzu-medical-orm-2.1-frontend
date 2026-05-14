import { api } from "@/shared/api/api";
import type { PreviewResponse, PreviewDataResponse } from "../model/types";

export const importApi = {
  uploadPreview: async (file: File): Promise<PreviewResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/requests/import/preview", formData);
    return data;
  },
  
  getPreviewData: async (sessionId: string): Promise<PreviewDataResponse> => {
    const { data } = await api.get(`/requests/import/${sessionId}/preview`);
    return data;
  },
  
  commitImport: async (sessionId: string) => {
    const { data } = await api.post(`/requests/import/${sessionId}/commit`);
    return data;
  },
  
  cancelImport: async (sessionId: string) => {
    const { data } = await api.delete(`/requests/import/${sessionId}/cancel`);
    return data;
  },
};