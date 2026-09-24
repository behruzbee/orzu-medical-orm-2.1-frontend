import { requestKeys } from "@/entities/patient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { whatsappApi } from "./apis";
import { useTranslation } from "@/shared/i18n";

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
  const { tr } = useTranslation();
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
        title: tr("Yuborildi 📨", "Отправлено 📨"),
        message: tr(
          "Xabar muvaffaqiyatli yuborildi",
          "Сообщение успешно отправлено",
        ),
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: tr("Xatolik 🚨", "Ошибка 🚨"),
        message:
          error.response?.data?.message ||
          tr(
            "WhatsApp xabarini yuborib bo'lmadi",
            "Не удалось отправить сообщение WhatsApp",
          ),
        color: "red",
      });
    },
  });
};
