import { useState } from "react";
import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
} from "@mantine/core";
import { IconSend, IconStethoscope } from "@tabler/icons-react";
import { useSendDoctorMessageMutation } from "@/entities/doctor-message";

interface Props {
  requestId: string;
  patientName: string;
}

export const PatientDoctorMessageForm = ({
  requestId,
  patientName,
}: Props) => {
  const [message, setMessage] = useState("");
  const sendMessageMutation = useSendDoctorMessageMutation();

  const handleSubmit = () => {
    const trimmed = message.trim();

    if (!trimmed) return;

    sendMessageMutation.mutate(
      {
        requestId,
        payload: { message: trimmed },
      },
      {
        onSuccess: () => setMessage(""),
      }
    );
  };

  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Stack gap="sm">
        <Group gap="xs" wrap="nowrap">
          <ThemeIcon color="red" variant="light" size="sm">
            <IconStethoscope size={16} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={700}>
              Shifokorga xabar
            </Text>
            <Text size="xs" c="dimmed">
              {patientName}
            </Text>
          </div>
        </Group>

        <Textarea
          minRows={3}
          autosize
          maxRows={8}
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          placeholder="Masalan: bemorga klizma buyurilgan, lekin kerak emas. Iltimos, tayinlovni tekshiring."
        />

        <Button
          leftSection={<IconSend size={16} />}
          onClick={handleSubmit}
          disabled={!message.trim()}
          loading={sendMessageMutation.isPending}
          color="red"
        >
          Vrachga yuborish
        </Button>
      </Stack>
    </Paper>
  );
};
