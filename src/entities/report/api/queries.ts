import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import type { GenerateReportPayload } from "../model/types";
import { reportsApi } from "./apis";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateReportPayload) => reportsApi.generate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      notifications.show({
        title: "Muvaffaqiyatli",
        message: "Hisobot muvaffaqiyatli shakllantirildi",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Xatolik",
        message: "Hisobotni yaratishda xatolik yuz berdi",
        color: "red",
      });
    },
  });
};

export const useDeleteReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      notifications.show({
        title: "O'chirildi",
        message: "Hisobot o'chirib tashlandi",
        color: "gray",
      });
    },
    onError: () => {
      notifications.show({
        title: "Xatolik",
        message: "O'chirishda xatolik yuz berdi",
        color: "red",
      });
    },
  });
};