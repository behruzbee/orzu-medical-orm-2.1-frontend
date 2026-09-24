import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { importApi } from "../api/import.api";
import { useTranslation } from "@/shared/i18n";

export const useUploadPreview = () => {
  const { tr } = useTranslation();
  return useMutation({
    mutationFn: importApi.uploadPreview,
    onSuccess: () => {
      notifications.show({
        title: tr("Tahlil tugadi 📊", "Анализ завершён 📊"),
        message: tr(
          "Excel fayl muvaffaqiyatli o'qildi",
          "Excel-файл успешно прочитан",
        ),
        color: "blue",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: tr("Faylni yuklashda xatolik 🚨", "Ошибка загрузки файла 🚨"),
        message:
          error.response?.data?.message ||
          tr(
            "Excel faylini yuklab yoki o'qib bo'lmadi",
            "Не удалось загрузить или прочитать Excel-файл",
          ),
        color: "red",
      });
    },
  });
};

export const usePreviewData = (sessionId: string | null) => {
  return useQuery({
    queryKey: ["import-preview", sessionId],
    queryFn: () => importApi.getPreviewData(sessionId!),
    enabled: !!sessionId,
  });
};

export const useCommitImport = () => {
  const { tr } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importApi.commitImport,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      notifications.show({
        title: tr("Saqlandi ✅", "Сохранено ✅"),
        message: tr(
          `Muvaffaqiyatli import qilindi: ${res?.imported || 0} ta`,
          `Успешно импортировано: ${res?.imported || 0}`,
        ),
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: tr("Saqlashda xatolik 🚨", "Ошибка сохранения 🚨"),
        message:
          error.response?.data?.message ||
          tr(
            "Import ma'lumotlarini saqlab bo'lmadi",
            "Не удалось сохранить данные импорта",
          ),
        color: "red",
      });
    },
  });
};

export const useCancelImport = () => {
  const { tr } = useTranslation();
  return useMutation({
    mutationFn: importApi.cancelImport,
    onSuccess: () => {
      notifications.show({
        title: tr("Bekor qilindi 🚫", "Отменено 🚫"),
        message: tr(
          "Import jarayoni to'xtatildi",
          "Процесс импорта остановлен",
        ),
        color: "gray",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: tr("Xatolik 🚨", "Ошибка 🚨"),
        message:
          error.response?.data?.message ||
          tr("Importni bekor qilib bo'lmadi", "Не удалось отменить импорт"),
        color: "red",
      });
    },
  });
};
