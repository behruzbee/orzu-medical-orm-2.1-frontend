import { api } from "@/shared/api/api";
import type { DoctorPatientMessage } from "../model/types";

export interface CreateDoctorMessagePayload {
  message: string;
}

export const doctorMessagesApi = {
  create: async (
    requestId: string,
    payload: CreateDoctorMessagePayload
  ): Promise<DoctorPatientMessage> => {
    const response = await api.post<DoctorPatientMessage>(
      `/doctor-messages/${requestId}`,
      payload
    );
    return response.data;
  },

  getPending: async (): Promise<DoctorPatientMessage[]> => {
    const response = await api.get<DoctorPatientMessage[]>(
      "/doctor-messages/pending"
    );
    return response.data;
  },

  markDone: async (messageId: string): Promise<DoctorPatientMessage> => {
    const response = await api.patch<DoctorPatientMessage>(
      `/doctor-messages/${messageId}/done`
    );
    return response.data;
  },

  getStreamUrl: (token: string): string => {
    const baseURL = api.defaults.baseURL || "";
    const params = new URLSearchParams({ token });
    return `${baseURL}/doctor-messages/stream?${params.toString()}`;
  },
};
