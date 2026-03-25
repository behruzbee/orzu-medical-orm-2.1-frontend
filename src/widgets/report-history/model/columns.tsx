import { Group, Text, Avatar, Badge, ThemeIcon } from "@mantine/core";
import { IconFileTypeXls } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { IReport } from "@/entities/report/model/types";
import { ReportActions } from "../ui/report-actions";

const columnHelper = createColumnHelper<IReport>();

export const useReportColumns = () => {
  return [
    columnHelper.accessor("name", {
      header: "Hisobot nomi",
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
      header: "Davr",
      cell: ({ row }) => (
        <Text size="sm" c="dimmed" style={{ whiteSpace: "nowrap" }}>
          {dayjs(row.original.startDate).format("DD.MM.YYYY")} -{" "}
          {dayjs(row.original.endDate).format("DD.MM.YYYY")}
        </Text>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Yaratilgan vaqt",
      cell: ({ getValue }) => (
        <Text size="sm">{dayjs(getValue()).format("DD.MM.YYYY HH:mm")}</Text>
      ),
    }),
    columnHelper.display({
      id: "operator",
      header: "Operator",
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
      header: "Holati",
      cell: ({ getValue }) => {
        const status = getValue();
        if (status === "ready") {
          return (
            <Badge color="green" variant="light" radius="sm">
              Tayyor
            </Badge>
          );
        }
        if (status === "processing") {
          return (
            <Badge color="blue" variant="light" radius="sm">
              Jarayonda
            </Badge>
          );
        }
        return (
          <Badge color="red" variant="light" radius="sm">
            Xatolik
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Amallar",
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
