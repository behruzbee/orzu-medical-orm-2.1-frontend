import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Text } from "@mantine/core";
import dayjs from "dayjs";
import type { ImportError } from "@/features/import-errors/api/apis";
import { useTranslation } from "@/shared/i18n";

const ERROR_CONFIG: Record<string, { uz: string; ru: string; color: string }> =
  {
    ACTIVE_REQUEST_EXISTS: {
      uz: "Faol ariza mavjud",
      ru: "Есть активная заявка",
      color: "blue",
    },
    DUPLICATE_FILE: {
      uz: "Faylda takroriy",
      ru: "Дубликат в файле",
      color: "orange",
    },
    DUPLICATE_DB: {
      uz: "Bazada takroriy",
      ru: "Дубликат в базе",
      color: "red",
    },
    INVALID_PHONE: {
      uz: "Noto'g'ri raqam",
      ru: "Неверный номер",
      color: "gray",
    },
    INVALID_DATES: {
      uz: "Sanada xatolik",
      ru: "Ошибка в датах",
      color: "yellow",
    },
    MISSING_DATA: {
      uz: "Ma'lumot to'liq emas",
      ru: "Неполные данные",
      color: "grape",
    },
    OTHER: { uz: "Boshqa xatolik", ru: "Другая ошибка", color: "dark" },
  };

const columnHelper = createColumnHelper<ImportError>();

export const useColumnsImportErrorsTable = () => {
  const { tr } = useTranslation();
  return useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        header: tr("Yuklangan vaqt", "Время загрузки"),
        cell: (info) => dayjs(info.getValue()).format("DD.MM.YYYY HH:mm"),
      }),
      columnHelper.accessor("name", {
        header: tr("Bemor (F.I.Sh)", "Пациент (Ф.И.О.)"),
        cell: (info) => (
          <Text size="sm" fw={500}>
            {info.getValue() || "-"}
          </Text>
        ),
      }),
      columnHelper.accessor("phone", {
        header: tr("Telefon", "Телефон"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("branch", {
        header: tr("Filial", "Филиал"),
        cell: (info) => info.getValue() || "-",
      }),
      // Добавляем дату заезда
      columnHelper.accessor("arrivalDate", {
        header: tr("Kelgan sana", "Дата прибытия"),
        cell: (info) =>
          info.getValue() ? dayjs(info.getValue()).format("DD.MM.YYYY") : "-",
      }),
      // Добавляем дату выезда
      columnHelper.accessor("departureDate", {
        header: tr("Ketgan sana", "Дата отъезда"),
        cell: (info) =>
          info.getValue() ? dayjs(info.getValue()).format("DD.MM.YYYY") : "-",
      }),
      columnHelper.accessor("category", {
        header: tr("Xatolik turi", "Тип ошибки"),
        cell: (info) => {
          const config = ERROR_CONFIG[info.getValue()] || ERROR_CONFIG.OTHER;
          return (
            <Badge color={config.color} variant="light">
              {tr(config.uz, config.ru)}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("errorMessages", {
        header: tr("Tafsilotlar", "Подробности"),
        cell: (info) => (
          <Text
            size="xs"
            color="dimmed"
            style={{ maxWidth: 250, whiteSpace: "normal" }}
          >
            {info.getValue()?.join("; ")}
          </Text>
        ),
      }),
      columnHelper.accessor("lineNumber", {
        header: tr("Excel qatori", "Строка Excel"),
        cell: (info) => (
          <Badge color="gray" variant="outline">
            {info.getValue()}-{tr("qator", "строка")}
          </Badge>
        ),
      }),
    ],
    [tr],
  );
};
