import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import type { GenerateReportPayload } from "../model/types";
import { reportsApi } from "./apis";
import { useTranslation } from "@/shared/i18n";

export const reportKeys = {
  all: ["reports"] as const,
};

export const useReports = () => {
  return useQuery({
    queryKey: reportKeys.all,
    queryFn: reportsApi.getAll,
  });
};

export const useGenerateReportMutation = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateReportPayload) =>
      reportsApi.generate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      notifications.show({
        title: tr("Muvaffaqiyatli", "Успешно"),
        message: tr(
          "Hisobot muvaffaqiyatli shakllantirildi",
          "Отчёт успешно сформирован",
        ),
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: tr("Xatolik", "Ошибка"),
        message: tr(
          "Hisobotni yaratishda xatolik yuz berdi",
          "Не удалось сформировать отчёт",
        ),
        color: "red",
      });
    },
  });
};

export const useDeleteReportMutation = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      notifications.show({
        title: tr("O'chirildi", "Удалено"),
        message: tr("Hisobot o'chirib tashlandi", "Отчёт удалён"),
        color: "gray",
      });
    },
    onError: () => {
      notifications.show({
        title: tr("Xatolik", "Ошибка"),
        message: tr(
          "O'chirishda xatolik yuz berdi",
          "Не удалось удалить отчёт",
        ),
        color: "red",
      });
    },
  });
};
