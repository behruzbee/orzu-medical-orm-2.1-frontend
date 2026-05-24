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
import { RequestStatus } from "@/entities/patient";

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
                { value: RequestStatus.NEW, label: "🔵 Yangi" },
                { value: RequestStatus.CONTACTED, label: "✅ Bog'landi" },
                { value: RequestStatus.ALL_OK, label: "👌 Hammasi ijobiy" },
                { value: RequestStatus.NO_ANSWER, label: "📵 Ko'tarmadi" },
                { value: RequestStatus.UNREACHABLE, label: "🔌 O'chirilgan" },
                { value: RequestStatus.WRONG_NUMBER, label: "⚠️ Xato raqami" },
                {
                  value: RequestStatus.HAS_NOT_WHATSAPP,
                  label: "📴 WhatsApp yo'q",
                },
                { value: RequestStatus.FEEDBACK_POSITIVE, label: "😊 Ijobiy" },
                {
                  value: RequestStatus.FEEDBACK_NEGATIVE,
                  label: "😡 Shikoyat",
                },
                {
                  value: RequestStatus.FEEDBACK_NOT_RELATED,
                  label: "🤷 Boshqa (Klinikaga xos emas)",
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
            Tozalash
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};
