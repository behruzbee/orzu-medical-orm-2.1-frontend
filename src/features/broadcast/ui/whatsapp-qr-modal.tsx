import { Alert, Center, Loader, Modal, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { api } from "@/shared/api/api";
import { useTranslation } from "@/shared/i18n";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function WhatsappQrModal({ opened, onClose }: Props) {
  const { tr } = useTranslation();
  const { data, isError } = useQuery({
    queryKey: ["whatsapp", "qr-status"],
    queryFn: async () => {
      const response = await api.get<{ connected: boolean; qr: string | null }>(
        "/whatsapp/qr-status",
      );
      return response.data;
    },
    enabled: opened,
    refetchInterval: opened ? 3000 : false,
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={tr("WhatsApp ulanishi", "Подключение WhatsApp")}
      centered
    >
      {isError ? (
        <Alert color="red">
          {tr("QR kodni yuklab bo'lmadi", "Не удалось загрузить QR-код")}
        </Alert>
      ) : data?.connected ? (
        <Alert color="green">
          {tr("WhatsApp ulangan", "WhatsApp подключён")}
        </Alert>
      ) : data?.qr ? (
        <Stack align="center" gap="md">
          <QRCodeSVG value={data.qr} size={220} level="H" />
          <Text size="sm" c="dimmed" ta="center">
            {tr(
              "QR kodni WhatsApp orqali skanerlang",
              "Сканируйте код в WhatsApp",
            )}
          </Text>
        </Stack>
      ) : (
        <Center mih={220}>
          <Loader />
        </Center>
      )}
    </Modal>
  );
}
