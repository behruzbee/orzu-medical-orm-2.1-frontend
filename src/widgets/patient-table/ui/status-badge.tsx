import { Badge } from "@mantine/core";
import { RequestStatus } from "@/entities/patient";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  [RequestStatus.NEW]: { label: "Yangi", color: "blue" },
  [RequestStatus.CONTACTED]: { label: "Bog'landi", color: "cyan" },
  [RequestStatus.HAS_NOT_WHATSAPP]: { label: "Whatsapp yo'q", color: "black" },
  [RequestStatus.ALL_OK]: { label: "Hammasi ijobiy", color: "green" },
  [RequestStatus.NO_ANSWER]: { label: "Javob bermadi", color: "yellow" },
  [RequestStatus.UNREACHABLE]: { label: "O'chirilgan", color: "orange" },
  [RequestStatus.WRONG_NUMBER]: { label: "Xato raqam", color: "gray" },
  [RequestStatus.FEEDBACK_POSITIVE]: { label: "Ijobiy fikr", color: "green" },
  [RequestStatus.FEEDBACK_NEGATIVE]: { label: "Shikoyat", color: "red" },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: "gray" };

  return (
    <Badge color={config.color} variant="light" radius="sm" tt="capitalize">
      {config.label}
    </Badge>
  );
};