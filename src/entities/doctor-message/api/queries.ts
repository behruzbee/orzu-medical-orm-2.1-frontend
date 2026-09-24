import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doctorMessagesApi, type CreateDoctorMessagePayload } from "./apis";
import { useTranslation } from "@/shared/i18n";

export const doctorMessageKeys = {
  all: ["doctor-messages"] as const,
  pending: () => ["doctor-messages", "pending"] as const,
};

export const usePendingDoctorMessages = (enabled = true) => {
  return useQuery({
    queryKey: doctorMessageKeys.pending(),
    queryFn: doctorMessagesApi.getPending,
    enabled,
    refetchInterval: enabled ? 10000 : false,
    refetchOnWindowFocus: true,
  });
};

export const useSendDoctorMessageMutation = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: CreateDoctorMessagePayload;
    }) => doctorMessagesApi.create(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorMessageKeys.all });

      notifications.show({
        title: tr("Xabar yuborildi", "Сообщение отправлено"),
        message: tr(
          "Shifokor kabinetida ogohlantirish ochiladi.",
          "В кабинете врача появится уведомление.",
        ),
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: tr("Xatolik", "Ошибка"),
        message:
          error?.response?.data?.message ||
          tr(
            "Shifokorga xabar yuborilmadi",
            "Не удалось отправить сообщение врачу",
          ),
        color: "red",
      });
    },
  });
};

export const useMarkDoctorMessageDoneMutation = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => doctorMessagesApi.markDone(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: doctorMessageKeys.pending(),
      });

      notifications.show({
        title: tr("Bajarildi", "Выполнено"),
        message: tr("Shifokor xabari yopildi.", "Сообщение врачу закрыто."),
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: tr("Xatolik", "Ошибка"),
        message:
          error?.response?.data?.message ||
          tr("Xabarni yopib bo'lmadi", "Не удалось закрыть сообщение"),
        color: "red",
      });
    },
  });
};
