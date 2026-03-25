import { Badge } from "@mantine/core";
import { PatientStatus } from "@/entities/patient";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  [PatientStatus.NEW]: { label: "Yangi", color: "blue" },
  [PatientStatus.CONTACTED]: { label: "Bog'landi", color: "cyan" },
  [PatientStatus.NO_ANSWER]: { label: "Javob bermadi", color: "yellow" },
  [PatientStatus.UNREACHABLE]: { label: "O'chirilgan", color: "orange" },
  [PatientStatus.WRONG_NUMBER]: { label: "Xato raqam", color: "gray" },
  [PatientStatus.FEEDBACK_POSITIVE]: { label: "Ijobiy fikr", color: "green" },
  [PatientStatus.FEEDBACK_NEGATIVE]: { label: "Shikoyat", color: "red" },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: "gray" };

  return (
    <Badge color={config.color} variant="light" radius="sm" tt="capitalize">
      {config.label}
    </Badge>
  );
};