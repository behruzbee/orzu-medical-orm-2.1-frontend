import { APP_PATHS } from "@/shared/constants/app-paths";
import { Button } from "@mantine/core";
import { IconPhone, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { RequestStatus } from "@/entities/patient";
import { useTranslation } from "@/shared/i18n";

interface Props {
  requestId: string;
  status: string;
}

export const TableActions = ({ requestId, status }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const activeStatuses = [RequestStatus.NEW, RequestStatus.CONTACTED];

  const isActive = activeStatuses.includes(status as RequestStatus);

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(APP_PATHS.PATIENT_PROFILE.PROFILE_PATH.replace(":id", requestId));
  };

  if (isActive) {
    return (
      <Button
        variant="light"
        color="blue"
        leftSection={<IconPhone size={16} />}
        size="xs"
        radius="xl"
        onClick={handleNavigate}
      >
        {t("action.call")}
      </Button>
    );
  }

  return (
    <Button
      variant="subtle"
      color="gray"
      leftSection={<IconEye size={16} />}
      size="xs"
      radius="xl"
      onClick={handleNavigate}
    >
      {t("action.history")}
    </Button>
  );
};
