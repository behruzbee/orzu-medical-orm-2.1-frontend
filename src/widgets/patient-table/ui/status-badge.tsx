import { Badge } from "@mantine/core";
import { RequestStatus } from "@/entities/patient";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  [RequestStatus.NEW]: { label: "Yangi", color: "blue" },
  [RequestStatus.CONTACTED]: { label: "Bog'landi", color: "cyan" },
  [RequestStatus.ALL_OK]: { label: "Hammasi ijobiy", color: "green" },
  [RequestStatus.NO_ANSWER]: { label: "Javob bermadi", color: "yellow" },
  [RequestStatus.UNREACHABLE]: { label: "O'chirilgan", color: "orange" },
  [RequestStatus.WRONG_NUMBER]: { label: "Xato raqam", color: "gray" },
  [RequestStatus.HAS_NOT_WHATSAPP]: { label: "WhatsApp yo'q", color: "violet" },
  [RequestStatus.EMPLOYEE]: { label: "Xodim raqami", color: "indigo" },
  [RequestStatus.FEEDBACK_POSITIVE]: { label: "Ijobiy fikr", color: "green" },
  [RequestStatus.FEEDBACK_NEGATIVE]: { label: "Shikoyat", color: "red" },
  [RequestStatus.FEEDBACK_NOT_RELATED]: {
    label: "Klinikaga xos emas",
    color: "dark",
  },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: "gray" };

  return (
    <Badge color={config.color} variant="light" radius="sm" tt="capitalize">
      {config.label}
    </Badge>
  );
};
