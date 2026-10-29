import { ActionIcon, Group, rem } from "@mantine/core";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import { useDeleteReportMutation } from "@/entities/report/api/queries";
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
      <ActionIcon
        variant="subtle"
        color="blue"
        disabled={status !== "ready"}
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
