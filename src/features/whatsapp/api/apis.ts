import { api } from "@/shared/api/api";
import type { IMessage } from "@/entities/chat";

export const whatsappApi = {
  getHistory: async (phone: string): Promise<IMessage[]> => {
    const encodedPhone = encodeURIComponent(phone);
    const response = await api.get<IMessage[]>(
      `/whatsapp/history?phone=${encodedPhone}`
    );
    return response.data;
  },

  sendMessage: async (payload: { phone: string; text: string }) => {
    return api.post("/whatsapp/send", payload);
  },
};
