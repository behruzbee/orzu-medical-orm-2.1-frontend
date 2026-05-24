import { api } from "@/shared/api/api";

export interface ImportError {
  id: string;
  sessionId: string;
  lineNumber: number;
  name: string;
  phone: string;
  branch: string;
  arrivalDate: string;
  departureDate: string;
  category: string;
  errorMessages: string[];
  createdAt: string;
}

export interface ImportErrorsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  branch?: string;
  startDate?: string;
  endDate?: string;
}

export const importErrorsApi = {
  getErrors: async (params: ImportErrorsParams) => {
    const response = await api.get("/requests/import/errors", { params });
    return response.data;
  },
};
