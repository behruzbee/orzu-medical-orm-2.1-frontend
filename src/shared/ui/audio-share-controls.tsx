import { useState } from "react";
import {
  ActionIcon,
  Alert,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconCopy, IconLink, IconLock } from "@tabler/icons-react";
import { api } from "@/shared/api/api";
import { useTranslation } from "@/shared/i18n";

export function AudioShareControls({
  source,
  feedbackId,
  id,
}: {
  source: string;
  feedbackId: string;
  id: string;
}) {
  const { language } = useTranslation();
  const uz = language === "uz";
  const [share, setShare] = useState<{ url: string; expiresAt: string }>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const headers = { "X-Audio-Playback": "1" };
  const create = async () => {
    setPending(true);
    setError(false);
    try {
      const { data } = await api.post(
        "/audio-playback/shares",
        { source, feedbackId, id },
        { headers },
      );
      setShare(data);
      setCopied(false);
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };
  const revoke = async () => {
    if (!share) return;
    setPending(true);
    setError(false);
    try {
      const token = new URLSearchParams(new URL(share.url).hash.slice(1)).get(
        "t",
      );
      await api.post("/audio-playback/shares/revoke", { token }, { headers });
      setShare(undefined);
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };
  return (
    <Stack gap="xs" maw={640}>
      <Group gap="sm" wrap="nowrap">
        {!share && (
          <Tooltip
            label={
              uz ? "Bir martalik havola yaratish" : "Создать одноразовую ссылку"
            }
          >
            <ActionIcon
              size="lg"
              variant="light"
              loading={pending}
              onClick={create}
              aria-label={
                uz
                  ? "Bir martalik havola yaratish"
                  : "Создать одноразовую ссылку"
              }
            >
              <IconLink size={20} />
            </ActionIcon>
          </Tooltip>
        )}
        {share && (
          <>
            <TextInput
              aria-label={uz ? "Bir martalik havola" : "Одноразовая ссылка"}
              readOnly
              value={share.url}
              style={{ flex: 1, minWidth: 0 }}
            />
            <Tooltip
              label={
                copied
                  ? uz
                    ? "Nusxalandi"
                    : "Скопировано"
                  : uz
                    ? "Nusxalash"
                    : "Копировать"
              }
            >
              <ActionIcon
                aria-label={uz ? "Nusxalash" : "Копировать"}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(share.url);
                    setCopied(true);
                  } catch {
                    setError(true);
                  }
                }}
              >
                <IconCopy size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={uz ? "Havolani bekor qilish" : "Отозвать ссылку"}>
              <ActionIcon
                color="red"
                variant="light"
                loading={pending}
                onClick={revoke}
                aria-label={uz ? "Havolani bekor qilish" : "Отозвать ссылку"}
              >
                <IconLock size={18} />
              </ActionIcon>
            </Tooltip>
          </>
        )}
      </Group>
      {share && (
        <Text size="xs" c="dimmed">
          {uz ? "Amal qilish muddati" : "Действует до"}:{" "}
          {new Date(share.expiresAt).toLocaleString(uz ? "uz-UZ" : "ru-RU")}
        </Text>
      )}
      {error && (
        <Alert color="red">
          {uz ? "Amal bajarilmadi." : "Не удалось выполнить действие."}
        </Alert>
      )}
    </Stack>
  );
}
