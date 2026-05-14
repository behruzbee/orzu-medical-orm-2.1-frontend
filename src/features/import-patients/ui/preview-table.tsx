import { Table, Badge, Text } from "@mantine/core";
import type { PreviewRow } from "../model/types";

interface PreviewTableProps {
  rows: PreviewRow[];
}

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ru-RU");
};

export const PreviewTable = ({ rows }: PreviewTableProps) => {
  return (
    <Table.ScrollContainer minWidth={900}>
      <Table
        withTableBorder
        withColumnBorders
        highlightOnHover
        verticalSpacing="sm"
      >
        <Table.Thead bg="gray.0">
          <Table.Tr>
            <Table.Th>Qator</Table.Th>
            <Table.Th>Bemor ismi</Table.Th>
            <Table.Th>Telefon</Table.Th>
            <Table.Th>Filial</Table.Th>
            <Table.Th>Kelgan sana</Table.Th>
            <Table.Th>Ketgan sana</Table.Th>
            <Table.Th>Holati</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr
              key={row.id}
              bg={row.hasErrors ? "red.0" : undefined}
            >
              <Table.Td fw={500}>{row.lineNumber}</Table.Td>
              <Table.Td>{row.name || "-"}</Table.Td>
              <Table.Td>{row.phone || "-"}</Table.Td>
              <Table.Td>{row.branch || "-"}</Table.Td>
              <Table.Td>{formatDate(row.arrivalDate)}</Table.Td>
              <Table.Td>{formatDate(row.departureDate)}</Table.Td>
              <Table.Td>
                {row.hasErrors ? (
                  <Text c="red.7" size="sm" fw={500}>
                    {row.errorDetails.join(", ")}
                  </Text>
                ) : (
                  <Badge color="green" variant="light" size="md">
                    Xatosiz
                  </Badge>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
