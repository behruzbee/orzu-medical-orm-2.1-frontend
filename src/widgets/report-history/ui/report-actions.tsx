import { ActionIcon, Group, rem } from "@mantine/core";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import { useDeleteReportMutation } from "@/entities/report/api/queries";
import { useTranslation } from "@/shared/i18n";

interface Props {
  reportId: string;
  fileUrl: string;
  status: string;
}

export const ReportActions = ({ reportId, fileUrl, status }: Props) => {
  const { tr } = useTranslation();
  const { mutate: deleteReport, isPending } = useDeleteReportMutation();

  const handleDownload = () => {
    window.open(fileUrl, "_blank");
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
