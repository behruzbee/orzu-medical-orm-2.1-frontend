import { api } from "@/shared/api/api";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/shared/i18n";

export const useBroadcastMutation = () => {
  const { tr } = useTranslation();
  return useMutation({
    mutationFn: (payload: any) => api.post("/whatsapp/broadcast", payload),
    onSuccess: (data) => {
      notifications.show({
        title: tr("Rassilka boshlandi 🚀", "Рассылка запущена 🚀"),
        message: tr(
          `${data.data.targetCount} ta bemorga xabar yuborilmoqda...`,
          `Сообщение отправляется ${data.data.targetCount} пациентам...`,
        ),
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: tr("Xatolik 🚨", "Ошибка 🚨"),
        message:
          error.response?.data?.message ||
          tr("Rassilkani boshlab bo'lmadi", "Не удалось запустить рассылку"),
        color: "red",
      });
    },
  });
};
