import { Stack, Grid, Button, Group, Text } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { AudienceFilters } from "@/features/broadcast/ui/audience-filters";
import { MobilePreview } from "@/features/broadcast/ui/mobile-preview";
import { MessageComposer } from "@/features/broadcast";

import { useBroadcastStore } from "@/entities/broadcast";
import { useBroadcastMutation } from "@/features/broadcast/api/queries"; 

export const BroadcastPage = () => {
  const { 
    messageText, 
    branch, 
    phoneCode, 
    status, 
    dateRange,
    resetStore
  } = useBroadcastStore();

  const { mutate: sendBroadcast, isPending } = useBroadcastMutation();

  const handleSend = () => {
    if (!messageText.trim()) return;

    // Формируем payload на основе фильтров из AudienceFilters
    const payload = {
      text: messageText,
      branch: branch || undefined,
      phoneCode: phoneCode || undefined,
      status: status || undefined,
      dateFrom: dateRange[0] ? dateRange[0].toISOString() : undefined,
      dateTo: dateRange[1] ? dateRange[1].toISOString() : undefined,
    };

    sendBroadcast(payload, {
      onSuccess: () => {
        resetStore(); 
      }
    });
  };

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Stack gap={0}>
          <Text size="xl" fw={700}>Xabarnoma yaratish (Broadcast)</Text>
          <Text size="sm" c="dimmed">WhatsApp orqali ommaviy xabar yuborish kampaniyasi</Text>
        </Stack>
        <Group>
          <Button
            color="blue"
            leftSection={<IconSend size={18} />}
            onClick={handleSend}
            disabled={!messageText} // Отключаем если нет текста
            loading={isPending}
          >
            Yuborish
          </Button>
        </Group>
      </Group>

      <Grid gutter="lg" style={{ flex: 1 }}>
        <Grid.Col span={{ base: 12, md: 3 }}><AudienceFilters /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}><MessageComposer /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}><MobilePreview /></Grid.Col>
      </Grid>
    </Stack>
  );
};