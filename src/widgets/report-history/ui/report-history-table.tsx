import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
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
  Loader,
} from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";
import { useReports } from "@/entities/report/api/queries";
import { useReportColumns } from "../model/columns";

export const ReportHistoryTable = () => {
  const { data: reports = [], isLoading } = useReports();

  const columns = useReportColumns();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data: reports,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  if (isLoading) {
    return (
      <Paper withBorder p="xl" radius="md" mt="md">
        <Center>
          <Loader color="gray" type="dots" />
        </Center>
      </Paper>
    );
  }

  const total = reports.length;
  const startRow =
    total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endRow = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    total
  );

  return (
    <Paper
      withBorder
      p="0"
      radius="md"
      mt="md"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
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
                      textAlign: header.id === "actions" ? "right" : "left",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>

          <Table.Tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              // Empty State
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
                      <Text c="dimmed">Hozircha hisobotlar mavjud emas</Text>
                    </Stack>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Footer Paginatsiya */}
      <Group
        justify="space-between"
        p="md"
        bg="var(--mantine-color-gray-0)"
        style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
      >
        <Text size="sm" c="dimmed">
          Ko'rsatilmoqda <b>{startRow}</b> - <b>{endRow}</b>, jami{" "}
          <b>{total}</b>
        </Text>

        <Pagination
          total={table.getPageCount()}
          value={pagination.pageIndex + 1}
          onChange={(page) => table.setPageIndex(page - 1)}
          size="sm"
          radius="md"
          color="brand"
          disabled={total === 0}
        />
      </Group>
    </Paper>
  );
};
