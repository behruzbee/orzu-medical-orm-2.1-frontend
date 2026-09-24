import {
  Stack,
  Text,
  Box,
  Group,
  ThemeIcon,
  Alert,
  Loader,
  Button,
} from "@mantine/core";
import { QRCodeSVG } from "qrcode.react";
import {
  IconBrandWhatsapp,
  IconInfoCircle,
  IconAlertCircle,
  IconPlugConnected,
} from "@tabler/icons-react";
import { useQrStream, useLoginMutation } from "../api/queries";
import { useNavigate } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/app-paths";
import { useTranslation } from "@/shared/i18n";

export const QrLogin = () => {
  const { tr } = useTranslation();
  const navigate = useNavigate();

  const { qrCode, error: streamError } = useQrStream();
  const { mutate, isPending, error: loginError } = useLoginMutation();

  // Проверяем, является ли ошибка сигналом о том, что сессия уже есть
  // Текст ошибки должен совпадать с тем, что мы написали в useQrStream (queries.ts)
  const isSessionActive =
    streamError?.includes("faol sessiya") ||
    streamError?.includes("активная сессия");

  const handleCheckLogin = () => {
    mutate(
      { method: "qr" },
      {
        onSuccess: () => {
          navigate(APP_PATHS.HOME.HOME_PATH);
        },
      },
    );
  };

  return (
    <Stack align="center" gap="md" py="xs">
      {(streamError && !isSessionActive) || loginError ? (
        <Alert
          variant="light"
          color="red"
          icon={<IconAlertCircle size={16} />}
          title={tr("Xatolik", "Ошибка")}
        >
          {streamError ||
            (loginError as any)?.response?.data?.message ||
            tr("Xatolik", "Ошибка")}
        </Alert>
      ) : null}

      <Box
        p="lg"
        bg="white"
        style={{
          border: isSessionActive ? "2px solid #40c057" : "1px solid #eee", // Зеленая рамка если активен
          borderRadius: 16,
          minHeight: 200,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSessionActive ? (
          <Stack align="center" gap="xs">
            <ThemeIcon size={60} radius="xl" color="green" variant="light">
              <IconPlugConnected size={32} />
            </ThemeIcon>
            <Text size="sm" fw={600} c="green">
              {tr("WhatsApp allaqachon ulangan!", "WhatsApp уже подключён!")}
            </Text>
            <Text size="xs" c="dimmed" ta="center">
              {tr(
                "QR kodni skanerlash shart emas.",
                "Сканировать QR-код не требуется.",
              )}
              <br />
              {tr(
                "Tizimga kirish tugmasini bosing.",
                "Нажмите кнопку входа в систему.",
              )}
            </Text>
          </Stack>
        ) : qrCode ? (
          <QRCodeSVG value={qrCode} size={180} level="H" />
        ) : (
          // ВАРИАНТ 3: Загрузка
          <Stack align="center" gap="xs">
            <Loader color="teal" size="sm" />
            <Text size="xs" c="dimmed">
              {tr("QR kod yuklanmoqda...", "QR-код загружается...")}
            </Text>
          </Stack>
        )}
      </Box>

      <Group gap="xs" display={isSessionActive ? "none" : "flex"}>
        <ThemeIcon variant="light" radius="xl" size="sm" color="teal">
          <IconBrandWhatsapp size={14} />
        </ThemeIcon>
        <Text size="sm" fw={600} c="dark">
          {tr("WhatsApp orqali tezkor kirish", "Быстрый вход через WhatsApp")}
        </Text>
      </Group>

      <Button
        style={{ display: isSessionActive ? "none" : "block" }}
        fullWidth
        onClick={handleCheckLogin}
        loading={isPending}
        disabled={
          (!qrCode && !isSessionActive && !streamError) || isSessionActive
        }
      >
        {tr("Men QR kodni skanerladim", "Я отсканировал QR-код")}
      </Button>

      {/* Инструкцию показываем только если нужно сканировать */}
      {!isSessionActive && (
        <Alert
          variant="light"
          color="blue"
          radius="md"
          icon={<IconInfoCircle size={16} />}
          title={tr("Qanday skanerlanadi:", "Как отсканировать:")}
          styles={{
            root: { width: "100%" },
            label: { fontSize: 13, fontWeight: 600 },
            message: { fontSize: 12, lineHeight: 1.4 },
          }}
        >
          {tr(
            "1. Telefoningizda WhatsAppni oching",
            "1. Откройте WhatsApp на телефоне",
          )}
          <br />
          {tr(
            "2. Menyu yoki Sozlamalarni bosing",
            "2. Откройте меню или настройки",
          )}
          <br />
          {tr(
            "3. Bog'langan qurilmalarni tanlang",
            "3. Выберите «Связанные устройства»",
          )}
          <br />
          {tr(
            "4. Kamerani ushbu ekranga yo'naltiring",
            "4. Наведите камеру на этот экран",
          )}
        </Alert>
      )}
    </Stack>
  );
};
