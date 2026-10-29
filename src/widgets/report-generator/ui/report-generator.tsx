import { useState } from "react";
import { Paper, Group, Button, Text, Checkbox, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconFileTypeXls } from "@tabler/icons-react";
import { useGenerateReportMutation } from "@/entities/report";
import { useTranslation } from "@/shared/i18n";

export const ReportGenerator = () => {
  const { tr } = useTranslation();
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [includePersonalData, setIncludePersonalData] = useState(false);

  const { mutate, isPending } = useGenerateReportMutation();

  const handleGenerate = () => {
    if (!value[0] || !value[1]) return;

    mutate(
      {
        startDate: new Date(value[0]).toISOString(),
        endDate: new Date(value[1]).toISOString(),
        includePersonalData,
      },
      {
        onSuccess: () => {
          setValue([null, null]);
          setIncludePersonalData(false);
        },
      },
    );
  };

  return (
    <Paper withBorder p="lg" radius="md" bg="white">
      <Text size="sm" fw={500} mb="xs">
        {tr("Vaqt oralig'ini tanlang", "Выберите период")}
      </Text>
      <Stack gap="md">
      <Group align="flex-start" gap="md">
        <DatePickerInput
          type="range"
          placeholder="DD.MM.YYYY - DD.MM.YYYY"
          value={value}
          onChange={(val) => setValue(val as [Date | null, Date | null])}
          style={{ flex: 1, maxWidth: 300 }}
          radius="md"
          clearable
        />
        <Button
          leftSection={<IconFileTypeXls size={20} />}
          color="blue"
          radius="md"
          loading={isPending}
          onClick={handleGenerate}
          disabled={!value[0] || !value[1]}
        >
          {tr("Hisobotni shakllantirish", "Сформировать отчёт")}
        </Button>
      </Group>
      <Checkbox
        checked={includePersonalData}
        onChange={(event) => setIncludePersonalData(event.currentTarget.checked)}
        label={tr(
          "Bemor ismlari, telefonlari va havolalarni kiritish",
          "Включить имена, телефоны и ссылки пациентов",
        )}
      />
      </Stack>
    </Paper>
  );
};
