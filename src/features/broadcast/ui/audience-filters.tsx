import { useBroadcastStore } from "@/entities/broadcast";
import { Paper, Stack, Select, Text, Group, Divider } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { PatientStatus } from "@/entities/patient";
import { PHONE_CODES_DATA } from "@/features/constants/filter-data";

export const AudienceFilters = () => {
  const {
    branch,
    setBranch,
    phoneCode,
    setPhoneCode,
    status,
    setStatus,
    dateRange,
    setDateRange,
  } = useBroadcastStore();

  // ✅ Преобразуем данные из store в массив объектов Date перед передачей в Mantine
  const parsedDateRange: [Date | null, Date | null] = [
    dateRange?.[0] ? new Date(dateRange[0]) : null,
    dateRange?.[1] ? new Date(dateRange[1]) : null,
  ];

  return (
    <Paper withBorder p="md" radius="md" h="100%">
      <Group justify="space-between" mb="md">
        <Text fw={700}>Filtrlar va Auditoriya</Text>
      </Group>

      <Stack gap="md">
        <Select
          label="Filialni tanlang"
          placeholder="Barcha filiallar"
          data={[
            "ОРЗУМЕД ЗАНГИОТА",
            "ОРЗУМЕД ЮНУСОБОД",
            "ОРЗУМЕД ФОТІМА-СУЛТОН",
            "ОРЗУМЕД ПАРКЕНТ",
            "ОРЗУМЕД ЯНГИБОЗОР",
            "ОРЗУМЕД ОКККУРГОН",
            "ОРЗУМЕД ЧИНОЗ",
          ]}
          value={branch}
          onChange={setBranch}
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
            { value: PatientStatus.FEEDBACK_NEGATIVE, label: "😡 Shikoyat" },
          ]}
          value={status}
          onChange={(v) => setStatus(v as PatientStatus)}
          clearable
        />

        <Select
          label="Telefon kodi"
          placeholder="Operator kodini tanlang"
          data={PHONE_CODES_DATA}
          value={phoneCode}
          onChange={setPhoneCode}
          clearable
          searchable
        />

        <DatePickerInput
          type="range"
          label="Sana oralig'i (Ketish)"
          placeholder="Sanani tanlang"
          value={parsedDateRange}
          onChange={(val) => {
            setDateRange(val as [Date | null, Date | null]);
          }}
          clearable
        />

        <Divider />

        <Paper
          bg="blue.0"
          p="md"
          radius="md"
          withBorder
          style={{ borderColor: "var(--mantine-color-blue-2)" }}
        >
          <Stack gap={0}>
            <Text size="sm" fw={600} c="blue.8">
              Tanlangan filtrlar:
            </Text>
            <Text size="xs" c="dimmed">
              {branch ? `Filial: ${branch}` : "Barcha filiallar"}
            </Text>
            <Text size="xs" c="dimmed">
              {status ? `Status: ${status}` : "Barcha statuslar"}
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
};
