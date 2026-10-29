import { ActionIcon, Group, rem } from "@mantine/core";
import { IconDownload, IconTrash, IconRefresh } from "@tabler/icons-react";
import { reportKeys, useDeleteReportMutation } from "@/entities/report/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "@/entities/report/api/apis";
import { useTranslation } from "@/shared/i18n";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

interface Props {
  reportId: string;
  fileName: string;
  status: string;
}

export const ReportActions = ({ reportId, fileName, status }: Props) => {
  const { tr } = useTranslation();
  const { mutate: deleteReport, isPending } = useDeleteReportMutation();
  const [downloading, setDownloading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const queryClient = useQueryClient();

  const handleRegenerate = async () => {
    if (!confirm(tr(
      "Joriy ma'lumotlardan qayta yaratasizmi? Yangi hisobot asl tarixiy fayl emas. Eski yozuv saqlanadi.",
      "Пересоздать из текущих данных? Новый отчёт не является оригинальным историческим файлом. Старая запись сохранится.",
    ))) return;
    setRegenerating(true);
    try {
      await reportsApi.regenerate(reportId);
      await queryClient.invalidateQueries({ queryKey: reportKeys.all });
      notifications.show({ color: "green", message: tr("Hisobot qayta yaratildi", "Отчёт пересоздан") });
    } catch {
      notifications.show({ color: "red", message: tr("Hisobotni qayta yaratib bo'lmadi", "Не удалось пересоздать отчёт") });
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await reportsApi.download(reportId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      notifications.show({
        color: "red",
        message: tr("Hisobotni yuklab bo'lmadi", "Не удалось скачать отчёт"),
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        tr(
          "Haqiqatan ham ushbu hisobotni o'chirmoqchimisiz?",
          "Вы действительно хотите удалить этот отчёт?",
        ),
      )
    ) {
      deleteReport(reportId);
    }
  };

  return (
    <Group gap={8} justify="flex-end">
      {status === "missing" && (
        <ActionIcon variant="subtle" color="orange" onClick={handleRegenerate} loading={regenerating} title={tr("Qayta yaratish", "Пересоздать")}>
          <IconRefresh style={{ width: rem(18), height: rem(18) }} />
        </ActionIcon>
      )}
      <ActionIcon
        variant="subtle"
        color="blue"
        disabled={status !== "ready" && status !== "recreated"}
        onClick={handleDownload}
        loading={downloading}
        title={tr("Yuklash", "Скачать")}
      >
        <IconDownload style={{ width: rem(18), height: rem(18) }} />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        color="red"
        onClick={handleDelete}
        loading={isPending}
        title={tr("O'chirish", "Удалить")}
      >
        <IconTrash style={{ width: rem(18), height: rem(18) }} />
      </ActionIcon>
    </Group>
  );
};
