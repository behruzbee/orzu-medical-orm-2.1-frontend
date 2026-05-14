import { Group, Avatar, Text } from "@mantine/core";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
// 1. Импортируем новый тип заявок (убедитесь, что путь к types правильный)
import type { IPatientRequest } from "@/entities/patient/model/types"; 
import { StatusBadge } from "../ui/status-badge";
import { TableActions } from "../ui/table-action";

export const useColumnsPatientTable = () => {
  // 2. Меняем тип на IPatientRequest
  const columns: ColumnDef<IPatientRequest>[] = [
    {
      // 3. Используем accessorFn для доступа к вложенным данным
      id: "name",
      accessorFn: (row) => row.patient?.name,
      header: "Bemor ismi",
      cell: ({ row }) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar color={row.original.patient?.avatarColor} radius="xl" size="sm">
            {row.original.patient?.name?.charAt(0) || "?"}
          </Avatar>
          <Text size="sm" fw={500}>
            {row.original.patient?.name || "Noma'lum"}
          </Text>
        </Group>
      ),
    },
    {
      id: "phone",
      accessorFn: (row) => row.patient?.phone,
      header: "Telefon raqami",
      cell: ({ getValue }) => (
        <Text size="sm" style={{ whiteSpace: "nowrap" }}>
          {getValue<string>() || "-"}
        </Text>
      ),
    },
    {
      accessorKey: "branch",
      header: "Filial",
      cell: ({ getValue }) => (
        <Text size="sm" c="dimmed">
          {getValue<string>()}
        </Text>
      ),
    },
    {
      accessorKey: "arrivalDate",
      header: "Kelish sanasi",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? dayjs(date).format("DD.MM.YYYY") : "-";
      },
    },
    {
      accessorKey: "departureDate",
      header: "Ketish sanasi",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? dayjs(date).format("DD.MM.YYYY") : "-";
      },
    },
    // --- НОВАЯ КОЛОНКА ---
    {
      id: "daysStayed",
      header: "Kunlar soni", // Количество дней
      accessorFn: (row) => {
        // Проверяем, есть ли обе даты
        if (row.arrivalDate && row.departureDate) {
          // Вычисляем разницу в днях
          return dayjs(row.departureDate).diff(dayjs(row.arrivalDate), 'day');
        }
        return null;
      },
      cell: ({ getValue }) => {
        const days = getValue<number | null>();
        return (
          <Text size="sm" fw={500}>
            {days !== null ? `${days} kun` : "-"}
          </Text>
        );
      },
    },
    // ---------------------
    {
      accessorKey: "status",
      header: "Holati",
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      id: "actions",
      header: "Amallar",
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