import { Table, Badge, Text } from "@mantine/core";
import type { PreviewRow } from "../model/types";
import { useTranslation } from "@/shared/i18n";

interface PreviewTableProps {
  rows: PreviewRow[];
}

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ru-RU");
};

export const PreviewTable = ({ rows }: PreviewTableProps) => {
  const { tr } = useTranslation();
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
            <Table.Th>{tr("Qator", "Строка")}</Table.Th>
            <Table.Th>{tr("Bemor ismi", "Имя пациента")}</Table.Th>
            <Table.Th>{tr("Telefon", "Телефон")}</Table.Th>
            <Table.Th>{tr("Filial", "Филиал")}</Table.Th>
            <Table.Th>{tr("Kelgan sana", "Дата прибытия")}</Table.Th>
            <Table.Th>{tr("Ketgan sana", "Дата отъезда")}</Table.Th>
            <Table.Th>{tr("Holati", "Статус")}</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.id} bg={row.hasErrors ? "red.0" : undefined}>
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
                    {tr("Xatosiz", "Без ошибок")}
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
