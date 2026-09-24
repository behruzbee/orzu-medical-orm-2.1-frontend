import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  requestsApi,
  type AddCallStatusPayload,
  type AddFeedbackPayload,
} from "./apis";
import type { RequestsQueryParams } from "../model/types";
import { useTranslation } from "@/shared/i18n";

export const requestKeys = {
  all: ["requests"] as const,
  list: (params: RequestsQueryParams) => ["requests", "list", params] as const,
  detail: (id: string) => ["requests", "detail", id] as const,
  stats: () => ["requests", "stats"],
};

export const useRequests = (params: RequestsQueryParams) => {
  return useQuery({
    queryKey: requestKeys.list(params),
    queryFn: () => requestsApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
};

export const useRequest = (id: string) => {
  return useQuery({
    queryKey: requestKeys.detail(id),
    queryFn: () => requestsApi.getById(id),
    enabled: !!id,
  });
};

export const useRevertRequestStatusMutation = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestsApi.revertStatus(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: requestKeys.stats() });

      notifications.show({
        title: tr("Status qaytarildi", "Статус восстановлен"),
        message:
          data.message ||
          tr(
            "Bemor bilan ishlashni davom ettirishingiz mumkin",
            "Можно продолжить работу с пациентом",
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
            "Muddat o'tib ketgan bo'lishi mumkin",
            "Возможно, срок восстановления истёк",
          ),
        color: "red",
      });
    },
  });
};

export const useAddCallStatusMutation = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddCallStatusPayload;
    }) => requestsApi.addCallStatus(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({
        queryKey: requestKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: requestKeys.stats() });

      notifications.show({
        title: tr("Status yangilandi", "Статус обновлён"),
        message: tr(
          "Qo'ng'iroq natijasi muvaffaqiyatli saqlandi",
          "Результат звонка успешно сохранён",
        ),
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: tr("Xatolik", "Ошибка"),
        message: tr(
          "Statusni o'zgartirishda xatolik yuz berdi",
          "Не удалось изменить статус",
        ),
        color: "red",
      });
    },
  });
};

export const useRequestStats = () => {
  return useQuery({
    queryKey: requestKeys.stats(),
    queryFn: () => requestsApi.getStats(),
    refetchOnWindowFocus: true,
  });
};

export const useAddFeedbackMutation = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string; // requestId
      payload: AddFeedbackPayload;
    }) => requestsApi.addFeedback(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({
        queryKey: requestKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: requestKeys.stats() });

      notifications.show({
        title: tr("Fikr saqlandi", "Обращение сохранено"),
        message: tr(
          "Bemor fikri muvaffaqiyatli ro'yxatga olindi",
          "Обращение пациента успешно зарегистрировано",
        ),
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: tr("Xatolik", "Ошибка"),
        message: tr(
          "Fikrni saqlashda xatolik yuz berdi",
          "Не удалось сохранить обращение",
        ),
        color: "red",
      });
    },
  });
};

export const useDeleteRequestMutation = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => requestsApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: requestKeys.stats() });

      notifications.show({
        title: tr("O'chirildi", "Удалено"),
        message: tr(
          "Ariza muvaffaqiyatli o'chirildi",
          "Заявка успешно удалена",
        ),
        color: "gray",
      });
    },
    onError: () => {
      notifications.show({
        title: tr("Xatolik", "Ошибка"),
        message: tr("O'chirish imkoniyati yo'q", "Удаление недоступно"),
        color: "red",
      });
    },
  });
};

export const usePatientProfile = (patientId: string) => {
  return useQuery({
    queryKey: ["requests", "profile", patientId],
    queryFn: () => requestsApi.getProfile(patientId),
    enabled: !!patientId,
  });
};

export const useDeletePatientMutation = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) => requestsApi.deletePatient(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: requestKeys.stats() });

      notifications.show({
        title: tr("Bemor o'chirildi", "Пациент удалён"),
        message: tr(
          "Bemor va uning barcha arizalari muvaffaqiyatli o'chirildi",
          "Пациент и все его заявки успешно удалены",
        ),
        color: "gray",
      });
    },
    onError: () => {
      notifications.show({
        title: tr("Xatolik", "Ошибка"),
        message: tr(
          "Bemorni o'chirishda xatolik yuz berdi",
          "Не удалось удалить пациента",
        ),
        color: "red",
      });
    },
  });
};
