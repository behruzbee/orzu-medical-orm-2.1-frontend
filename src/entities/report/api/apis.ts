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

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },
};