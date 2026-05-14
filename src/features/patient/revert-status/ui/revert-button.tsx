import { Button, Modal, Text, Group } from "@mantine/core";
import { IconHistory } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useRevertRequestStatusMutation } from "@/entities/patient/api";

interface Props {
  patientId: string;
  onSuccess?: () => void;
}

export const RevertStatusButton = ({ patientId, onSuccess }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate, isPending } = useRevertRequestStatusMutation();

  const handleRevert = () => {
    mutate(patientId, {
      onSuccess: () => {
        close();
        onSuccess?.();
      }
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
        Statusni qaytarish
      </Button>

      <Modal opened={opened} onClose={close} title="Statusni qaytarish" centered>
        <Text size="sm" mb="lg">
          Haqiqatan ham ushbu bemorning statusini <b>"Bog'landi" (Contacted)</b> holatiga qaytarmoqchimisiz? 
          Bu suhbatni davom ettirish imkonini beradi.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>Yo'q</Button>
          <Button color="orange" loading={isPending} onClick={handleRevert}>Ha, qaytarish</Button>
        </Group>
      </Modal>
    </>
  );
};