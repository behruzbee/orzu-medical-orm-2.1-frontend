import { Group, Avatar, Text } from "@mantine/core";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
// 1. Импортируем новый тип заявок (убедитесь, что путь к types правильный)
import type { IPatientRequest } from "@/entities/patient/model/types";
import { StatusBadge } from "../ui/status-badge";
import { TableActions } from "../ui/table-action";
import { useTranslation } from "@/shared/i18n";

export const useColumnsPatientTable = () => {
  const { t } = useTranslation();
  // 2. Меняем тип на IPatientRequest
  const columns: ColumnDef<IPatientRequest>[] = [
    {
      // 3. Используем accessorFn для доступа к вложенным данным
      id: "name",
      accessorFn: (row) => row.patient?.name,
      header: t("table.patient"),
      cell: ({ row }) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar
            color={row.original.patient?.avatarColor}
            radius="xl"
            size="sm"
          >
            {row.original.patient?.name?.charAt(0) || "?"}
          </Avatar>
          <Text size="sm" fw={500}>
            {row.original.patient?.name || t("table.unknown")}
          </Text>
        </Group>
      ),
    },
    {
      id: "phone",
      accessorFn: (row) => row.patient?.phone,
      header: t("table.phone"),
      cell: ({ getValue }) => (
        <Text size="sm" style={{ whiteSpace: "nowrap" }}>
          {getValue<string>() || "-"}
        </Text>
      ),
    },
    {
      accessorKey: "branch",
      header: t("table.branch"),
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          {getValue<string>()}
        </Text>
      ),
    },
    {
      accessorKey: "arrivalDate",
      header: t("table.arrival"),
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? dayjs(date).format("DD.MM.YYYY") : "-";
      },
    },
    {
      accessorKey: "departureDate",
      header: t("table.departure"),
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? dayjs(date).format("DD.MM.YYYY") : "-";
      },
    },
    // --- НОВАЯ КОЛОНКА ---
    {
      id: "daysStayed",
      header: t("table.days"),
      accessorFn: (row) => {
        // Проверяем, есть ли обе даты
        if (row.arrivalDate && row.departureDate) {
          // Вычисляем разницу в днях
          return dayjs(row.departureDate).diff(dayjs(row.arrivalDate), "day");
        }
        return null;
      },
      cell: ({ getValue }) => {
        const days = getValue<number | null>();
        return (
          <Text size="sm" fw={500}>
            {days !== null ? `${days} ${t("table.day")}` : "-"}
          </Text>
        );
      },
    },
    // ---------------------
    {
      accessorKey: "status",
      header: t("table.status"),
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      id: "actions",
      header: t("table.actions"),
      cell: ({ row }) => (
        <TableActions
          requestId={row.original.id}
          status={row.original.status}
        />
      ),
    },
  ];

  return columns;
};
