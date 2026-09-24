import { Button, Modal, Text, Group } from "@mantine/core";
import { IconHistory } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useRevertRequestStatusMutation } from "@/entities/patient/api";
import { useTranslation } from "@/shared/i18n";

interface Props {
  patientId: string;
  onSuccess?: () => void;
}

export const RevertStatusButton = ({ patientId, onSuccess }: Props) => {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate, isPending } = useRevertRequestStatusMutation();

  const handleRevert = () => {
    mutate(patientId, {
      onSuccess: () => {
        close();
        onSuccess?.();
      },
    });
  };

  return (
    <>
      <Button
        variant="light"
        color="orange"
        size="xs"
        leftSection={<IconHistory size={16} />}
        onClick={open}
      >
        {t("archive.revert")}
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title={t("archive.revert")}
        centered
      >
        <Text size="sm" mb="lg">
          {t("archive.revertQuestion")}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            {t("common.no")}
          </Button>
          <Button color="orange" loading={isPending} onClick={handleRevert}>
            {t("common.yesRevert")}
          </Button>
        </Group>
      </Modal>
    </>
  );
};
