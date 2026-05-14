import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { importApi } from "../api/import.api";

export const useUploadPreview = () =>
  useMutation({
    mutationFn: importApi.uploadPreview,
    onSuccess: () => {
      notifications.show({
        title: "Tahlil tugadi 📊",
        message: "Excel fayl muvaffaqiyatli o'qildi",
        color: "blue",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Faylni yuklashda xatolik 🚨",
        message:
          error.response?.data?.message ||
          "Failed to upload or parse Excel file (Client Error)",
        color: "red",
      });
    },
  });

export const usePreviewData = (sessionId: string | null) => {
  return useQuery({
    queryKey: ["import-preview", sessionId],
    queryFn: () => importApi.getPreviewData(sessionId!),
    enabled: !!sessionId,
  });
};

export const useCommitImport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importApi.commitImport,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      notifications.show({
        title: "Saqlandi ✅",
        message: `Muvaffaqiyatli import qilindi: ${res?.imported || 0} ta`,
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Saqlashda xatolik 🚨",
        message:
          error.response?.data?.message ||
          "Failed to commit import data (Client Error)",
        color: "red",
      });
    },
  });
};

export const useCancelImport = () =>
  useMutation({
    mutationFn: importApi.cancelImport,
    onSuccess: () => {
      notifications.show({
        title: "Bekor qilindi 🚫",
        message: "Import jarayoni to'xtatildi",
        color: "gray",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Xatolik 🚨",
        message:
          error.response?.data?.message ||
          "Failed to cancel import (Client Error)",
        color: "red",
      });
    },
  });
