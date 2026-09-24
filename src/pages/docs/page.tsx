import { Stack, Title, Text } from "@mantine/core";
import { ReportGenerator } from "@/widgets/report-generator/ui/report-generator";
import { ReportHistoryTable } from "@/widgets/report-history/ui/report-history-table";
import { useTranslation } from "@/shared/i18n";

export const DocsPage = () => {
  const { tr } = useTranslation();
  return (
    <Stack gap="lg" p="md" h="100%">
      <div>
        <Title order={2}>
          {tr("Hujjatlar va hisobotlar", "Документы и отчёты")}
        </Title>
        <Text c="dimmed" size="sm">
          {tr(
            "Bemorlar bo'yicha Excel hisobotlarini yuklab olish",
            "Формирование Excel-отчётов по пациентам",
          )}
        </Text>
      </div>

      <ReportGenerator />

      <ReportHistoryTable />
    </Stack>
  );
};
