import { useBroadcastStore } from "@/entities/broadcast";
import { Paper, Stack, Select, Text, Group, Divider } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { RequestStatus } from "@/entities/patient";
import { getPhoneCodesData } from "@/features/constants/filter-data";
import { useTranslation } from "@/shared/i18n";

export const AudienceFilters = () => {
  const { language, tr } = useTranslation();
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
        <Text fw={700}>
          {tr("Filtrlar va auditoriya", "Фильтры и аудитория")}
        </Text>
      </Group>

      <Stack gap="md">
        <Select
          label={tr("Filialni tanlang", "Выберите филиал")}
          placeholder={tr("Barcha filiallar", "Все филиалы")}
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
          value={status}
          onChange={(v) => setStatus(v as RequestStatus)}
          clearable
          checkIconPosition="right"
        />

        <Select
          label={tr("Telefon kodi", "Телефонный код")}
          placeholder={tr("Operator kodini tanlang", "Выберите код оператора")}
          data={getPhoneCodesData(language)}
          value={phoneCode}
          onChange={setPhoneCode}
          clearable
          searchable
        />

        <DatePickerInput
          type="range"
          label={tr("Sana oralig'i (Ketish)", "Период (дата отъезда)")}
          placeholder={tr("Sanani tanlang", "Выберите даты")}
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
              {tr("Tanlangan filtrlar:", "Выбранные фильтры:")}
            </Text>
            <Text size="xs" c="dimmed">
              {branch
                ? `${tr("Filial", "Филиал")}: ${branch}`
                : tr("Barcha filiallar", "Все филиалы")}
            </Text>
            <Text size="xs" c="dimmed">
              {status
                ? `${tr("Status", "Статус")}: ${status}`
                : tr("Barcha statuslar", "Все статусы")}
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
};
