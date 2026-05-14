import { api } from "@/shared/api/api";
import type { IMessage } from "@/entities/chat"; // Убедитесь, что путь правильный

export const whatsappApi = {
  getHistory: async (phone: string): Promise<IMessage[]> => {
    const encodedPhone = encodeURIComponent(phone);
    const response = await api.get<IMessage[]>(
      `/whatsapp/history?phone=${encodedPhone}`
    );
    return response.data;
  },

  // 👇 Добавили requestId в payload
  sendMessage: async (payload: { phone: string; text: string; requestId: string }) => {
    return api.post("/whatsapp/send", payload);
  },
};