import { Stack, Grid, Button, Group, Text } from "@mantine/core";
import { IconQrcode, IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { AudienceFilters } from "@/features/broadcast/ui/audience-filters";
import { MobilePreview } from "@/features/broadcast/ui/mobile-preview";
import { MessageComposer } from "@/features/broadcast";

import { useBroadcastStore } from "@/entities/broadcast";
import { useBroadcastMutation } from "@/features/broadcast/api/queries";
import { useTranslation } from "@/shared/i18n";
import { useMe } from "@/features/auth/api/queries";
import { WhatsappQrModal } from "@/features/broadcast/ui/whatsapp-qr-modal";

export const BroadcastPage = () => {
  const { tr } = useTranslation();
  const { data: user } = useMe();
  const [qrOpened, setQrOpened] = useState(false);
  const { messageText, branch, phoneCode, status, dateRange, resetStore } =
    useBroadcastStore();

  const { mutate: sendBroadcast, isPending } = useBroadcastMutation();

  const handleSend = () => {
    if (!messageText.trim()) return;

    const from = dateRange?.[0] ? new Date(dateRange[0]) : null;
    const to = dateRange?.[1] ? new Date(dateRange[1]) : null;

    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    const payload = {
      text: messageText,
      branch: branch || undefined,
      phoneCode: phoneCode || undefined,
      status: status || undefined,
      dateFrom: from ? from.toISOString() : undefined,
      dateTo: to ? to.toISOString() : undefined,
    };

    sendBroadcast(payload, {
      onSuccess: () => {
        resetStore();
      },
    });
  };

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Stack gap={0}>
          <Text size="xl" fw={700}>
            {tr("Xabarnoma yaratish", "Создание рассылки")}
          </Text>
          <Text size="sm" c="dimmed">
            {tr(
              "WhatsApp orqali ommaviy xabar yuborish kampaniyasi",
              "Массовая рассылка сообщений через WhatsApp",
            )}
          </Text>
        </Stack>
        <Group>
          {user?.role === "admin" && (
            <Button
              variant="light"
              leftSection={<IconQrcode size={18} />}
              onClick={() => setQrOpened(true)}
            >
              {tr("WhatsApp ulash", "Подключить WhatsApp")}
            </Button>
          )}
          <Button
            color="blue"
            leftSection={<IconSend size={18} />}
            onClick={handleSend}
            disabled={!messageText} // Отключаем если нет текста
            loading={isPending}
          >
            {tr("Yuborish", "Отправить")}
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
      <WhatsappQrModal opened={qrOpened} onClose={() => setQrOpened(false)} />
    </Stack>
  );
};
