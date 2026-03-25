import { Stack, Title, Text } from "@mantine/core";
import { ReportGenerator } from "@/widgets/report-generator/ui/report-generator";
import { ReportHistoryTable } from "@/widgets/report-history/ui/report-history-table";

export const DocsPage = () => {
  return (
    <Stack gap="lg" p="md" h="100%">
      <div>
        <Title order={2}>Hujjatlar va Hisobotlar</Title>
        <Text c="dimmed" size="sm">
          Bemorlar bo'yicha Excel hisobotlarini yuklab olish
        </Text>
      </div>

      <ReportGenerator />

      <ReportHistoryTable />
    </Stack>
  );
};
