import { useState } from "react";
import { Modal, Button, Textarea, Stack, Text, Group, Badge } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useBroadcastMutation } from "../api";
import { useFilterStore } from "@/features/filter-patients/store/filter-store";
// import { useBroadcastMutation } from "./api/queries";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export const BroadcastModal = ({ opened, onClose }: Props) => {
  const [text, setText] = useState("");
  const filters = useFilterStore();
  const { mutate: sendBroadcast, isPending } = useBroadcastMutation();

  const handleSend = () => {
    if (!text.trim()) return;

    // Собираем текущие фильтры из стора
    const payload = {
      text,
      status: filters.status || undefined,
      branch: filters.selectedBranches.length > 0 ? filters.selectedBranches[0] : undefined,
      phoneCode: filters.selectedCode || undefined,
      dateFrom: filters.dateRange[0] ? filters.dateRange[0].toISOString() : undefined,
      dateTo: filters.dateRange[1] ? filters.dateRange[1].toISOString() : undefined,
    };

    sendBroadcast(payload, {
      onSuccess: () => {
        setText("");
        onClose();
      }
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Massaviy xabar yuborish (Rassilka)" centered>
      <Stack>
        <Group justify="space-between" bg="blue.0" p="xs" style={{ borderRadius: 8 }}>
          <Text size="sm" fw={500}>Joriy filtrlangan bemorlarga yuboriladi</Text>
          <Badge color="blue">{filters.getActiveCount()} ta aktiv filtr</Badge>
        </Group>

        <Textarea
          label="Xabar matni"
          placeholder="Assalomu alaykum, sizning natijalaringiz tayyor..."
          minRows={5}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          required
        />

        <Button 
          fullWidth 
          color="brand" 
          leftSection={<IconSend size={18} />}
          onClick={handleSend}
          loading={isPending}
          disabled={!text.trim()}
        >
          Yuborish
        </Button>
      </Stack>
    </Modal>
  );
};