import { ImportFlow } from "@/features/import-patients/ui/import-flow";
import { useTranslation } from "@/shared/i18n";

export const ImportPatientsPage = () => {
  const { tr } = useTranslation();
  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>
        {tr("Raqamlarni yuklash", "Загрузка номеров")}
      </h2>

      <ImportFlow />
    </div>
  );
};
