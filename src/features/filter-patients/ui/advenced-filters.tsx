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
  COUNTRIES_DATA,
  PHONE_CODES_DATA,
} from "@/features/constants/filter-data";
import { PatientStatus } from "@/entities/patient";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export const AdvancedFilters = ({ opened, onClose }: Props) => {
  const filters = useFilterStore();
  const activeCount = filters.getActiveCount();

  const currentCountry =
    filters.selectedCountries.length > 0 ? filters.selectedCountries[0] : null;

  const handleCountryChange = (val: string | null) => {
    if (val) {
      filters.setCountries([val]); // Сохраняем как массив из 1 элемента
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
          <Text fw={600}>Bazani filtrlash</Text>
        </Group>
      }
    >
      <Stack justify="space-between" h="calc(100vh - 60px)">
        <Stack gap="lg" p="md" style={{ overflowY: "auto" }}>
          {/* 1. Geografiya */}
          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Geografiya
            </Text>
            {/* 🔥 ЗАМЕНИЛИ MULTISELECT НА SELECT */}
            <Select
              label="Yashash mamlakati"
              placeholder="Mamlakatni tanlang"
              data={COUNTRIES_DATA}
              value={currentCountry}
              onChange={handleCountryChange}
              searchable
              clearable
              checkIconPosition="right"
            />
          </Stack>

          <Divider />

          {/* 2. Telefon Kodi */}
          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Telefon kodi
            </Text>
            <Select
              label="Operator kodi"
              placeholder="Kodni tanlang (masalan, 90)"
              data={PHONE_CODES_DATA}
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
              Bemor ma'lumotlari
            </Text>

            <Select
              label="Filial"
              placeholder="Filialni tanlang"
              data={[
                "ОРЗУМЕД ЗАНГИОТА",
                "ОРЗУМЕД ЮНУСОБОД",
                "ОРЗУМЕД ФОТИМА СУЛТОН",
                "ОРЗУМЕД ПАРКЕНТ",
                "ОРЗУМЕД ЯНГИБОЗОР",
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
              label="Kelish sanasi"
              placeholder="Sanani tanlang"
              value={filters.dateRange}
              onChange={(val) => filters.setDateRange(val)}
              clearable
            />

            <Select
              label="Bemor statusi"
              placeholder="Statusni tanlang"
              data={[
                { value: PatientStatus.NEW, label: "🔵 Yangi" },
                { value: PatientStatus.CONTACTED, label: "✅ Bog'landi" },
                { value: PatientStatus.NO_ANSWER, label: "📵 Ko'tarmadi" },
                { value: PatientStatus.UNREACHABLE, label: "🔌 O'chirilgan" },
                { value: PatientStatus.WRONG_NUMBER, label: "⚠️ Xato raqami" },
                { value: PatientStatus.FEEDBACK_POSITIVE, label: "😊 Ijobiy" },
                {
                  value: PatientStatus.FEEDBACK_NEGATIVE,
                  label: "😡 Shikoyat",
                },
              ]}
              value={filters.status}
              onChange={(val) => filters.setStatus(val as PatientStatus)}
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
            Tozalash
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};
