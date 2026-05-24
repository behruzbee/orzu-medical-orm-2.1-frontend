import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Text } from "@mantine/core";
import dayjs from "dayjs";
import type { ImportError } from "@/features/import-errors/api/apis";

const ERROR_CONFIG: Record<string, { label: string; color: string }> = {
  ACTIVE_REQUEST_EXISTS: { label: "Faol ariza mavjud", color: "blue" },
  DUPLICATE_FILE: { label: "Faylda takroriy", color: "orange" },
  DUPLICATE_DB: { label: "Bazada takroriy", color: "red" },
  INVALID_PHONE: { label: "Noto'g'ri raqam", color: "gray" },
  INVALID_DATES: { label: "Sanada xatolik", color: "yellow" },
  MISSING_DATA: { label: "Ma'lumot to'liq emas", color: "grape" },
  OTHER: { label: "Boshqa xatolik", color: "dark" },
};

const columnHelper = createColumnHelper<ImportError>();

export const useColumnsImportErrorsTable = () => {
  return useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        header: "Yuklangan vaqt",
        cell: (info) => dayjs(info.getValue()).format("DD.MM.YYYY HH:mm"),
      }),
      columnHelper.accessor("name", {
        header: "Bemor (F.I.Sh)",
        cell: (info) => (
          <Text size="sm" fw={500}>
            {info.getValue() || "-"}
          </Text>
        ),
      }),
      columnHelper.accessor("phone", {
        header: "Telefon",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("branch", {
        header: "Filial",
        cell: (info) => info.getValue() || "-",
      }),
      // Добавляем дату заезда
      columnHelper.accessor("arrivalDate", {
        header: "Kelgan sana",
        cell: (info) => 
          info.getValue() ? dayjs(info.getValue()).format("DD.MM.YYYY") : "-",
      }),
      // Добавляем дату выезда
      columnHelper.accessor("departureDate", {
        header: "Ketgan sana",
        cell: (info) => 
          info.getValue() ? dayjs(info.getValue()).format("DD.MM.YYYY") : "-",
      }),
      columnHelper.accessor("category", {
        header: "Xatolik turi",
        cell: (info) => {
          const config = ERROR_CONFIG[info.getValue()] || ERROR_CONFIG.OTHER;
          return (
            <Badge color={config.color} variant="light">
              {config.label}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("errorMessages", {
        header: "Tafsilotlar",
        cell: (info) => (
          <Text size="xs" color="dimmed" style={{ maxWidth: 250, whiteSpace: "normal" }}>
            {info.getValue()?.join("; ")}
          </Text>
        ),
      }),
      columnHelper.accessor("lineNumber", {
        header: "Excel Qator",
        cell: (info) => (
          <Badge color="gray" variant="outline">
            {info.getValue()}-qator
          </Badge>
        ),
      }),
    ],
    []
  );
};