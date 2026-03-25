import { Stack, Grid, Button, Group, Text } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { AudienceFilters } from "@/features/broadcast/ui/audience-filters";
import { MobilePreview } from "@/features/broadcast/ui/mobile-preview";
import { useBroadcastStore } from "@/entities/broadcast";
import { MessageComposer } from "@/features/broadcast";

export const BroadcastPage = () => {
  const { messageText, audienceCount } = useBroadcastStore();

  const handleSend = () => {
    // В реальном проекте здесь будет запрос на бэкенд
    console.log("Sending broadcast...", { messageText, audienceCount });
    alert(`Xabarnoma ${audienceCount} ta bemorga yuborilmoqda!`);
  };

  return (
    <Stack h="100%" gap="md">
      {/* HEADER PAGE */}
      <Group justify="space-between">
        <Stack gap={0}>
          <Text size="xl" fw={700}>
            Xabarnoma yaratish (Broadcast)
          </Text>
          <Text size="sm" c="dimmed">
            WhatsApp orqali ommaviy xabar yuborish kampaniyasi
          </Text>
        </Stack>
        <Group>
          <Button
            color="blue"
            leftSection={<IconSend size={18} />}
            onClick={handleSend}
            disabled={!messageText}
          >
            Yuborish
          </Button>
        </Group>
      </Group>

      <Grid gutter="lg" style={{ flex: 1 }}>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <AudienceFilters />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <MessageComposer />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <MobilePreview />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
