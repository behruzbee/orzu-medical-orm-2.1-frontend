import { Group, Avatar, Text } from "@mantine/core";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { IPatient } from "@/entities/patient";
import { StatusBadge } from "../ui/status-badge";
import { TableActions } from "../ui/table-action";

export const useColumnsPatientTable = () => {
  const columns: ColumnDef<IPatient>[] = [
    {
      accessorKey: "name",
      header: "Bemor ismi", // ФИО
      cell: ({ row }) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar color={row.original.avatarColor} radius="xl" size="sm">
            {row.original.name.charAt(0)}
          </Avatar>
          <Text size="sm" fw={500}>
            {row.original.name}
          </Text>
        </Group>
      ),
    },
    {
      accessorKey: "phone",
      header: "Telefon raqami",
      cell: ({ getValue }) => (
        <Text size="sm" style={{ whiteSpace: "nowrap" }}>
          {getValue<string>()}
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
      accessorKey: "departureDate",
      header: "Ketish sanasi",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? dayjs(date).format("DD.MM.YYYY") : "-";
      },
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
      accessorKey: "status",
      header: "Holati",
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      id: "actions",
      header: "Amallar",
      cell: ({ row }) => (
        <TableActions
          patientId={row.original.id}
          status={row.original.status}
        />
      ),
    },
  ];

  return columns;
};