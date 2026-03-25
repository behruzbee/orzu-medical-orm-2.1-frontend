import { useState } from "react";
import { Paper, Group, Button, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconFileTypeXls } from "@tabler/icons-react";
import { useGenerateReportMutation } from "@/entities/report";

export const ReportGenerator = () => {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  const { mutate, isPending } = useGenerateReportMutation();

  const handleGenerate = () => {
    if (!value[0] || !value[1]) return;

    mutate(
      {
        startDate: new Date(value[0]).toISOString(),
        endDate: new Date(value[1]).toISOString(),
      },
      {
        onSuccess: () => {
          setValue([null, null]);
        },
      }
    );
  };

  return (
    <Paper withBorder p="lg" radius="md" bg="white">
      <Text size="sm" fw={500} mb="xs">
        Vaqt oralig'ini tanlang
      </Text>
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
          Hisobotni shakllantirish
        </Button>
      </Group>
    </Paper>
  );
};
