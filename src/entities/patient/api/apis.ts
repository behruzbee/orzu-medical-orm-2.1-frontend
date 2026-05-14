import { api } from "@/shared/api/api";
import type {
  IPatientRequest,
  RequestsResponse,
  RequestsQueryParams,
  RequestStatus,
  EvidenceType,
  EvidenceSource,
  IDashboardStats,
} from "../model/types";

export interface AddCallStatusPayload {
  status: RequestStatus;
  note?: string;
}

export interface EvidencePayload {
  type: EvidenceType;
  text?: string;
  mediaUrl?: string;
  duration?: string;
  source?: EvidenceSource;
  sender?: "operator" | "patient";
  originalTimestamp?: string;
}

export interface AddFeedbackPayload {
  type: "complaint" | "suggestion"; // Добавлено на основе параметров бэкенда
  ratings: Record<string, number>;
  comment?: string;
  sendToTrello?: boolean; 
  evidence: EvidencePayload[];
}

export const requestsApi = {
  // Получаем список заявок
  getAll: async (params: RequestsQueryParams): Promise<RequestsResponse> => {
    const response = await api.get<RequestsResponse>("/requests", { params });
    return response.data;
  },

  // Получаем конкретную заявку
  getById: async (id: string): Promise<IPatientRequest> => {
    const response = await api.get<IPatientRequest>(`/requests/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/requests/${id}`);
  },

  addCallStatus: async (
    id: string, // Это теперь requestId
    payload: AddCallStatusPayload
  ): Promise<any> => {
    const response = await api.patch(`/requests/${id}/call-status`, payload);
    return response.data;
  },

  addFeedback: async (
    id: string, // Это теперь requestId
    payload: AddFeedbackPayload
  ): Promise<any> => {
    const response = await api.patch(`/requests/${id}/feedback`, payload);
    return response.data;
  },

  getStats: async (): Promise<IDashboardStats> => {
    const response = await api.get<IDashboardStats>("/requests/stats");
    return response.data;
  },

  revertStatus: async (id: string): Promise<{ message: string; status: string }> => {
    const response = await api.patch(`/requests/${id}/revert-status`);
    return response.data; // Обновлено: бэкенд возвращает объект { message, status }
  },
};