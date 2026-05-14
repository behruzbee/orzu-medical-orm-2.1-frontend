import { api } from "@/shared/api/api";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

export const useBroadcastMutation = () => {
  return useMutation({
    mutationFn: (payload: any) => api.post('/whatsapp/broadcast', payload),
    onSuccess: (data) => {
      notifications.show({
        title: "Rassilka boshlandi 🚀",
        message: `${data.data.targetCount} ta bemorga xabar yuborilmoqda...`,
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Xatolik 🚨",
        message: error.response?.data?.message || "Broadcast failed to start (Client/Network Error)",
        color: "red",
      });
    },
  });
};