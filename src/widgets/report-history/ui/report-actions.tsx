import { ActionIcon, Group, rem } from "@mantine/core";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import { useDeleteReportMutation } from "@/entities/report/api/queries";

interface Props {
  reportId: string;
  fileUrl: string;
  status: string;
}

export const ReportActions = ({ reportId, fileUrl, status }: Props) => {
  const { mutate: deleteReport, isPending } = useDeleteReportMutation();

  const handleDownload = () => {
    window.open(fileUrl, "_blank");
  };

  const handleDelete = () => {
    if (confirm("Haqiqatan ham ushbu hisobotni o'chirmoqchimisiz?")) {
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
        title="Yuklash"
      >
        <IconDownload style={{ width: rem(18), height: rem(18) }} />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        color="red"
        onClick={handleDelete}
        loading={isPending}
        title="O'chirish"
      >
        <IconTrash style={{ width: rem(18), height: rem(18) }} />
      </ActionIcon>
    </Group>
  );
};