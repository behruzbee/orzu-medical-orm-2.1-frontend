import { useState } from "react";
import {
  Paper,
  Title,
  Group,
  TextInput,
  Select,
  Button,
  Flex,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates"; // <-- Импорт календаря
import dayjs from "dayjs";
import type { PaginationState } from "@tanstack/react-table";
import {
  ImportErrorsTable,
  useImportErrorsQuery,
} from "@/features/import-errors";

export const ImportErrorsPage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [category, setCategory] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const startDate = dateRange[0]
    ? dayjs(dateRange[0]).format("YYYY-MM-DD")
    : undefined;
  const endDate = dateRange[1]
    ? dayjs(dateRange[1]).format("YYYY-MM-DD")
    : undefined;

  const { data, isLoading, isFetching } = useImportErrorsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    category: category || undefined,
    branch: branch || undefined,
    startDate,
    endDate,
  });

  const clearFilters = () => {
    setSearch("");
    setCategory(null);
    setBranch(null);
    setDateRange([null, null]);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  return (
    <Paper p="md" radius="md">
      <Group justify="space-between" mb="lg">
        <Title order={3}>Import Xatoliklari Tarixi</Title>
      </Group>

      <Flex gap="md" align="flex-end" wrap="wrap" mb="md">
        <TextInput
          label="Qidiruv"
          placeholder="Ism yoki telefon"
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1, minWidth: 200 }}
        />

        <Select
          label="Xatolik turi"
          placeholder="Barchasi"
          data={[
            { value: "ACTIVE_REQUEST_EXISTS", label: "Faol ariza mavjud" },
            { value: "DUPLICATE_FILE", label: "Faylda takroriy" },
            { value: "DUPLICATE_DB", label: "Bazada takroriy" },
            { value: "INVALID_PHONE", label: "Noto'g'ri raqam" },
            { value: "INVALID_DATES", label: "Sanada xatolik" },
            { value: "MISSING_DATA", label: "Ma'lumot to'liq emas" },
          ]}
          value={category}
          onChange={(v) => {
            setCategory(v);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
          clearable
          style={{ flex: 1, minWidth: 200 }}
        />

        <Select
          label="Filial"
          placeholder="Barcha filiallar"
          data={[
            "ОРЗУМЕД ЗАНГИОТА",
            "ОРЗУМЕД ЮНУСОБОД",
            "ОРЗУМЕД ФОТИМА СУЛТОН",
            "ОРЗУМЕД ПАРКЕНТ",
            "ОРЗУМЕД ЯНГИБОЗОР",
            "ОРЗУМЕД ОККУРГОН",
            "ОРЗУМЕД Насима Бону",
          ]}
          value={branch}
          onChange={(v) => {
            setBranch(v);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
          clearable
          searchable
          style={{ flex: 1, minWidth: 200 }}
        />

        <DatePickerInput
          type="range"
          label="Kelgan sana (Kelish sanasi)"
          placeholder="Sanani tanlang"
          value={dateRange}
          onChange={(val) => {
            setDateRange(val as [Date | null, Date | null]);

            if ((val[0] && val[1]) || (!val[0] && !val[1])) {
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }
          }}
          clearable
          style={{ flex: 1, minWidth: 250 }}
        />

        {(search || category || branch || dateRange[0]) && (
          <Button
            variant="light"
            color="red"
            leftSection={<IconX size={16} />}
            onClick={clearFilters}
          >
            Tozalash
          </Button>
        )}
      </Flex>

      <ImportErrorsTable
        data={data?.data || []}
        total={data?.total || 0}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading || isFetching}
      />
    </Paper>
  );
};
