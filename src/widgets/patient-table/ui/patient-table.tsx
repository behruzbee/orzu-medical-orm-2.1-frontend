import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type PaginationState,
  type OnChangeFn,
} from "@tanstack/react-table";
import {
  Table,
  Paper,
  Pagination,
  Group,
  Text,
  Center,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";
import { useColumnsPatientTable } from "../model/columns";

import type { IPatientRequest } from "@/entities/patient/model/types";

interface Props {
  data: IPatientRequest[];
  total: number;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  loading?: boolean;
}

export const PatientTable = ({
  data,
  total,
  pagination,
  setPagination,
  loading,
}: Props) => {
  const columns = useColumnsPatientTable();

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pagination.pageSize),
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const startRow =
    total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endRow = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    total,
  );

  return (
    <Paper
      withBorder
      p="0"
      radius="md"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <Table.ScrollContainer minWidth={800}>
        <Table
          verticalSpacing="md"
          horizontalSpacing="lg"
          highlightOnHover
          stickyHeader
        >
          <Table.Thead bg="var(--mantine-color-gray-0)">
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th
                    key={header.id}
                    style={{
                      color: "var(--mantine-color-gray-6)",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>

          <Table.Tbody
            style={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.2s" }}
          >
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Center py={60}>
                    <Stack align="center" gap="xs">
                      <ThemeIcon
                        color="gray"
                        variant="light"
                        size="xl"
                        radius="md"
                      >
                        <IconDatabaseOff size={24} />
                      </ThemeIcon>
                      <Text c="dimmed">Нет данных по вашему запросу</Text>
                    </Stack>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Group
        justify="space-between"
        p="md"
        bg="var(--mantine-color-gray-0)"
        style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
      >
        <Text size="sm" c="dimmed">
          Показано <b>{startRow}</b> - <b>{endRow}</b> из <b>{total}</b>{" "}
          результатов
        </Text>

        <Pagination
          total={table.getPageCount()}
          value={pagination.pageIndex + 1}
          onChange={(page) => table.setPageIndex(page - 1)}
          size="sm"
          radius="md"
          color="brand"
          disabled={total === 0 || loading}
        />
      </Group>
    </Paper>
  );
};
