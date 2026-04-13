import { api } from "@/shared/api/api";
import type {
  IPatient,
  PatientsResponse,
  PatientsQueryParams,
  PatientStatus,
  EvidenceType,
  EvidenceSource,
  IDashboardStats,
} from "../model/types";

// --- DTOs (Data Transfer Objects) для запросов ---

// Данные для смены статуса звонка (оператор звонит)
export interface AddCallStatusPayload {
  status: PatientStatus;
  note?: string;
}

// Данные для одного доказательства (внутри жалобы)
export interface EvidencePayload {
  type: EvidenceType;
  text?: string;
  mediaUrl?: string;
  duration?: string;
  source?: EvidenceSource; // 'whatsapp' | 'manual'
  sender?: "operator" | "patient";
  originalTimestamp?: string;
}

// Данные для создания жалобы/отзыва
export interface AddFeedbackPayload {
  ratings: Record<string, number>;
  comment?: string;
  sendToTrello?: boolean; 
  evidence: EvidencePayload[];
}

// --- API Methods ---

export const patientsApi = {
  getAll: async (params: PatientsQueryParams): Promise<PatientsResponse> => {
    const response = await api.get<PatientsResponse>("/patients", { params });
    return response.data;
  },

  getById: async (id: string): Promise<IPatient> => {
    const response = await api.get<IPatient>(`/patients/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  addCallStatus: async (
    id: string,
    payload: AddCallStatusPayload
  ): Promise<any> => {
    const response = await api.patch(`/patients/${id}/call-status`, payload);
    return response.data;
  },

  addFeedback: async (
    id: string,
    payload: AddFeedbackPayload
  ): Promise<any> => {
    const response = await api.patch(`/patients/${id}/feedback`, payload);
    return response.data;
  },

  getStats: async (): Promise<IDashboardStats> => {
    const response = await api.get<IDashboardStats>("/patients/stats");
    return response.data;
  },

  revertStatus: async (id: string): Promise<IPatient> => {
    const response = await api.patch<IPatient>(`/patients/${id}/revert-status`);
    return response.data;
  },
};
