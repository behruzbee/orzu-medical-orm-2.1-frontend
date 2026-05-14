import { ImportFlow } from "@/features/import-patients/ui/import-flow";

export const ImportPatientsPage = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Raqamlarni yuklash</h2>

      <ImportFlow />
    </div>
  );
};
