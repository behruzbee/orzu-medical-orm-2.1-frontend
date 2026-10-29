import { Stack, Title, Text } from "@mantine/core";
import { ReportGenerator } from "@/widgets/report-generator/ui/report-generator";
import { ReportHistoryTable } from "@/widgets/report-history/ui/report-history-table";
import { useTranslation } from "@/shared/i18n";
import { useMe } from "@/features/auth/api/queries";
import { Navigate } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/app-paths";

export const DocsPage = () => {
  const { tr } = useTranslation();
  const { data: user } = useMe();
  if (user?.role !== "admin") {
    return <Navigate to={APP_PATHS.HOME.HOME_PATH} replace />;
  }
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
