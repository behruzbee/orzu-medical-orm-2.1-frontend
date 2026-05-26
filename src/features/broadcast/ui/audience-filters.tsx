import { useBroadcastStore } from "@/entities/broadcast";
import { Paper, Stack, Select, Text, Group, Divider } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { RequestStatus } from "@/entities/patient";
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
            "ОРЗУМЕД ФОТИМА СУЛТОН",
            "ОРЗУМЕД ПАРКЕНТ",
            "ОРЗУМЕД Янгибозор",
            "ОРЗУМЕД ОККУРГОН",
            "ОРЗУМЕД Насима Бону",
          ]}
          value={branch}
          onChange={setBranch}
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
            { value: RequestStatus.HAS_NOT_WHATSAPP, label: "📴 WhatsApp yo'q" },
            { value: RequestStatus.EMPLOYEE, label: "👔 Xodim raqami" },
            { value: RequestStatus.FEEDBACK_POSITIVE, label: "😊 Ijobiy" },
            { value: RequestStatus.FEEDBACK_NEGATIVE, label: "😡 Shikoyat" },
            {
              value: RequestStatus.FEEDBACK_NOT_RELATED,
              label: "🤷 Boshqa (Klinikaga xos emas)",
            },
          ]}
          value={status} 
          onChange={(v) => setStatus(v as RequestStatus)}
          clearable
          checkIconPosition="right"
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