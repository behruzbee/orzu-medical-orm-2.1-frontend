import { APP_PATHS } from "@/shared/constants/app-paths";
import { Button } from "@mantine/core";
import { IconPhone, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PatientStatus } from "@/entities/patient";

interface Props {
  patientId: string;
  status: string;
}

export const TableActions = ({ patientId, status }: Props) => {
  const navigate = useNavigate();

  const activeStatuses = [PatientStatus.NEW, PatientStatus.CONTACTED];
  
  const isActive = activeStatuses.includes(status as PatientStatus);

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(APP_PATHS.PATIENT_PROFILE.PROFILE_PATH.replace(":id", patientId));
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
        Qo'ng'iroq
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
      Tarix
    </Button>
  );
};