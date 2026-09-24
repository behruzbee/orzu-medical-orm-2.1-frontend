import {
  Drawer,
  Stack,
  Select,
  Button,
  Group,
  Divider,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconFilter } from "@tabler/icons-react";
import { useFilterStore } from "../store/filter-store";
import {
  getCountriesData,
  getPhoneCodesData,
} from "@/features/constants/filter-data";
import { RequestStatus } from "@/entities/patient";
import { useTranslation } from "@/shared/i18n";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export const AdvancedFilters = ({ opened, onClose }: Props) => {
  const { language, tr } = useTranslation();
  const filters = useFilterStore();
  const activeCount = filters.getActiveCount();

  const currentCountry =
    filters.selectedCountries.length > 0 ? filters.selectedCountries[0] : null;

  const handleCountryChange = (val: string | null) => {
    if (val) {
      filters.setCountries([val]);
    } else {
      filters.setCountries([]);
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      padding="0"
      title={
        <Group px="md" pt="md">
          <IconFilter size={20} />
          <Text fw={600}>{tr("Bazani filtrlash", "Фильтрация базы")}</Text>
        </Group>
      }
    >
      <Stack justify="space-between" h="calc(100vh - 60px)">
        <Stack gap="lg" p="md" style={{ overflowY: "auto" }}>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {tr("Geografiya", "География")}
            </Text>
            <Select
              label={tr("Yashash mamlakati", "Страна проживания")}
              placeholder={tr("Mamlakatni tanlang", "Выберите страну")}
              data={getCountriesData(language)}
              value={currentCountry}
              onChange={handleCountryChange}
              searchable
              clearable
              checkIconPosition="right"
            />
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {tr("Telefon kodi", "Телефонный код")}
            </Text>
            <Select
              label={tr("Operator kodi", "Код оператора")}
              placeholder={tr(
                "Kodni tanlang (masalan, 90)",
                "Выберите код, например 90",
              )}
              data={getPhoneCodesData(language)}
              value={filters.selectedCode}
              onChange={filters.setCode}
              searchable
              clearable
              maxDropdownHeight={300}
              checkIconPosition="right"
            />
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {tr("Bemor ma'lumotlari", "Данные пациента")}
            </Text>

            <Select
              label={tr("Filial", "Филиал")}
              placeholder={tr("Filialni tanlang", "Выберите филиал")}
              data={[
                "ОРЗУМЕД ЗАНГИОТА",
                "ОРЗУМЕД ЮНУСОБОД",
                "ОРЗУМЕД ФОТИМА СУЛТОН",
                "ОРЗУМЕД ПАРКЕНТ",
                "ОРЗУМЕД Янгибозор",
                "ОРЗУМЕД ОККУРГОН",
                "ОРЗУМЕД Насима Бону",
              ]}
              value={filters.selectedBranches[0] || null}
              onChange={(val) =>
                val ? filters.setBranches([val]) : filters.setBranches([])
              }
              clearable
              checkIconPosition="right"
            />

            <DatePickerInput
              type="range"
              label={tr("Kelish sanasi", "Дата прибытия")}
              placeholder={tr("Sanani tanlang", "Выберите даты")}
              value={filters.dateRange}
              onChange={(val) => filters.setDateRange(val)}
              clearable
            />

            <Select
              label={tr("Bemor statusi", "Статус пациента")}
              placeholder={tr("Statusni tanlang", "Выберите статус")}
              data={[
                { value: RequestStatus.NEW, label: tr("🔵 Yangi", "🔵 Новый") },
                {
                  value: RequestStatus.CONTACTED,
                  label: tr("✅ Bog'landi", "✅ Связались"),
                },
                {
                  value: RequestStatus.ALL_OK,
                  label: tr("👌 Hammasi ijobiy", "👌 Всё хорошо"),
                },
                {
                  value: RequestStatus.NO_ANSWER,
                  label: tr("📵 Ko'tarmadi", "📵 Не ответил"),
                },
                {
                  value: RequestStatus.UNREACHABLE,
                  label: tr("🔌 O'chirilgan", "🔌 Недоступен"),
                },
                {
                  value: RequestStatus.WRONG_NUMBER,
                  label: tr("⚠️ Xato raqami", "⚠️ Неверный номер"),
                },
                {
                  value: RequestStatus.HAS_NOT_WHATSAPP,
                  label: tr("📴 WhatsApp yo'q", "📴 Нет WhatsApp"),
                },
                {
                  value: RequestStatus.EMPLOYEE,
                  label: tr("👔 Xodim raqami", "👔 Номер сотрудника"),
                },
                {
                  value: RequestStatus.FEEDBACK_POSITIVE,
                  label: tr("😊 Ijobiy", "😊 Положительный"),
                },
                {
                  value: RequestStatus.FEEDBACK_NEGATIVE,
                  label: tr("😡 Shikoyat", "😡 Жалоба"),
                },
                {
                  value: RequestStatus.FEEDBACK_NOT_RELATED,
                  label: tr(
                    "🤷 Boshqa (Klinikaga xos emas)",
                    "🤷 Другое (не относится к клинике)",
                  ),
                },
              ]}
              value={filters.status}
              onChange={(val) => filters.setStatus(val as RequestStatus)}
              clearable
              checkIconPosition="right"
            />
          </Stack>
        </Stack>

        <Stack
          p="md"
          bg="var(--mantine-color-body)"
          style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
        >
          <Button
            variant="subtle"
            color="red"
            fullWidth
            onClick={filters.resetFilters}
            disabled={activeCount === 0}
          >
            {tr("Tozalash", "Очистить")}
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};
