import { Group, Text, Avatar, Badge, ThemeIcon } from "@mantine/core";
import { IconFileTypeXls } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { IReport } from "@/entities/report/model/types";
import { ReportActions } from "../ui/report-actions";
import { useTranslation } from "@/shared/i18n";

const columnHelper = createColumnHelper<IReport>();

export const useReportColumns = () => {
  const { tr } = useTranslation();
  return [
    columnHelper.accessor("name", {
      header: tr("Hisobot nomi", "Название отчёта"),
      cell: ({ row }) => (
        <Group gap="xs" wrap="nowrap">
          <ThemeIcon color="green.1" c="green.8" size="lg" radius="md">
            <IconFileTypeXls size={20} />
          </ThemeIcon>
          <Text size="sm" fw={600} style={{ whiteSpace: "nowrap" }}>
            {row.original.name}
          </Text>
        </Group>
      ),
    }),
    columnHelper.accessor("startDate", {
      header: tr("Davr", "Период"),
      cell: ({ row }) => (
        <Text size="sm" c="dimmed" style={{ whiteSpace: "nowrap" }}>
          {dayjs(row.original.startDate).format("DD.MM.YYYY")} -{" "}
          {dayjs(row.original.endDate).format("DD.MM.YYYY")}
        </Text>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: tr("Yaratilgan vaqt", "Дата создания"),
      cell: ({ getValue }) => (
        <Text size="sm">{dayjs(getValue()).format("DD.MM.YYYY HH:mm")}</Text>
      ),
    }),
    columnHelper.display({
      id: "operator",
      header: tr("Operator", "Оператор"),
      cell: () => (
        <Group gap="xs">
          <Avatar radius="xl" size="sm" color="blue">
            A
          </Avatar>
          <Text size="sm" fw={500}>
            Admin
          </Text>
        </Group>
      ),
    }),
    columnHelper.accessor("status", {
      header: tr("Holati", "Статус"),
      cell: ({ getValue }) => {
        const status = getValue();
        if (status === "ready") {
          return (
            <Badge color="green" variant="light" radius="sm">
              {tr("Tayyor", "Готов")}
            </Badge>
          );
        }
        if (status === "processing") {
          return (
            <Badge color="blue" variant="light" radius="sm">
              {tr("Jarayonda", "В процессе")}
            </Badge>
          );
        }
        return (
          <Badge color="red" variant="light" radius="sm">
            {tr("Xatolik", "Ошибка")}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: tr("Amallar", "Действия"),
      cell: ({ row }) => (
        <ReportActions
          reportId={row.original.id}
          fileUrl={row.original.fileUrl}
          status={row.original.status}
        />
      ),
    }),
  ];
};
