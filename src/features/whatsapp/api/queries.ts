import { requestKeys } from "@/entities/patient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { whatsappApi } from "./apis";

export const whatsappKeys = {
  history: (phone: string) => ["whatsapp", "history", phone] as const,
};

export const useWhatsappHistory = (phone: string) => {
  return useQuery({
    queryKey: whatsappKeys.history(phone),
    queryFn: () => whatsappApi.getHistory(phone),
    enabled: !!phone,
    refetchInterval: 3000,
  });
};

export const useWhatsappSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApi.sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: whatsappKeys.history(variables.phone),
      });

      queryClient.invalidateQueries({
        queryKey: requestKeys.detail(variables.requestId),
      });

      notifications.show({
        title: "Yuborildi 📨",
        message: "Xabar muvaffaqiyatli yuborildi",
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Xatolik 🚨",
        message:
          error.response?.data?.message ||
          "Failed to send WhatsApp message (Client Error)",
        color: "red",
      });
    },
  });
};
