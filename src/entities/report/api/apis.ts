import { api } from "@/shared/api/api"; // Ваш настроенный axios instance
import type { IReport, GenerateReportPayload } from "../model/types";

export const reportsApi = {
  getAll: async (): Promise<IReport[]> => {
    const response = await api.get<IReport[]>("/reports");
    return response.data;
  },

  generate: async (payload: GenerateReportPayload): Promise<IReport> => {
    const response = await api.post<IReport>("/reports/generate", payload);
    return response.data;
  },

  download: async (id: string): Promise<Blob> => {
    const response = await api.get<Blob>(`/reports/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  regenerate: async (id: string): Promise<IReport> => {
    const response = await api.post<IReport>(`/reports/${id}/regenerate`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },
};
