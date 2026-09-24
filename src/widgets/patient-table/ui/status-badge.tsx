import { Badge } from "@mantine/core";
import { RequestStatus } from "@/entities/patient";
import { useTranslation, type TranslationKey } from "@/shared/i18n";

const STATUS_CONFIG: Record<string, { key: TranslationKey; color: string }> = {
  [RequestStatus.NEW]: { key: "status.new", color: "blue" },
  [RequestStatus.CONTACTED]: { key: "status.contacted", color: "cyan" },
  [RequestStatus.ALL_OK]: { key: "status.all_ok", color: "green" },
  [RequestStatus.NO_ANSWER]: { key: "status.no_answer", color: "yellow" },
  [RequestStatus.UNREACHABLE]: { key: "status.unreachable", color: "orange" },
  [RequestStatus.WRONG_NUMBER]: { key: "status.wrong_number", color: "gray" },
  [RequestStatus.HAS_NOT_WHATSAPP]: {
    key: "status.has_not_whatsapp",
    color: "violet",
  },
  [RequestStatus.EMPLOYEE]: { key: "status.employee", color: "indigo" },
  [RequestStatus.FEEDBACK_POSITIVE]: {
    key: "status.feedback_pos",
    color: "green",
  },
  [RequestStatus.FEEDBACK_NEGATIVE]: {
    key: "status.feedback_neg",
    color: "red",
  },
  [RequestStatus.FEEDBACK_NOT_RELATED]: {
    key: "status.feedback_not_related",
    color: "dark",
  },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      color={config?.color || "gray"}
      variant="light"
      radius="sm"
      tt="capitalize"
    >
      {config ? t(config.key) : status}
    </Badge>
  );
};
