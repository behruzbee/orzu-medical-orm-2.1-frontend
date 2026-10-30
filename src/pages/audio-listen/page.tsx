import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  Container,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
import {
  guestAudioApi,
  ProtectedAudioPlayer,
} from "@/shared/ui/protected-audio-player";
import { useTranslation } from "@/shared/i18n";

export function AudioListenPage() {
  const { language } = useTranslation();
  const uz = language === "uz";
  const [token] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get("t") || "",
  );
  const [result, setResult] = useState<{ available: boolean; path: string }>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    // The fragment never reaches the web server; remove it from the active history entry too.
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );
    const controller = new AbortController();
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
      setFailed(true);
      return;
    }
    guestAudioApi
      .post<{ available: boolean; path: string }>(
        "/audio-guest/status",
        { token },
        {
          headers: { "X-Audio-Playback": "1" },
          signal: controller.signal,
        },
      )
      .then(({ data }) => {
        if (
          !/^\/archive\/(v1|v2|v21)\/feedbacks\/[0-9a-f-]{36}\/evidence\/[0-9a-f-]{36}$/.test(
            data.path,
          )
        )
          throw Error("Invalid destination");
        setResult(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [token]);

  return (
    <Container size={640} py="xl" style={{ minHeight: "100dvh" }}>
      <Stack gap="xl">
        <Group gap="md">
          <Image
            src="/orzu-icon.png"
            alt="Orzu Medical"
            w={56}
            h={56}
            fit="contain"
          />
          <Title order={1} size="h3">
            Orzu Medical
          </Title>
        </Group>
        <Title order={2} size="h4">
          {uz ? "Ovozli xabar" : "Голосовое сообщение"}
        </Title>
        {!result && !failed && (
          <Loader aria-label={uz ? "Yuklanmoqda" : "Загрузка"} />
        )}
        {result?.available && (
          <ProtectedAudioPlayer
            source=""
            feedbackId=""
            id=""
            guestToken={token}
            onConsumed={() =>
              setResult(
                (current) => current && { ...current, available: false },
              )
            }
          />
        )}
        {result && !result.available && (
          <Text c="dimmed">
            {uz ? "Mehmon kirishi yakunlandi." : "Гостевой доступ завершён."}
          </Text>
        )}
        {failed && (
          <Alert color="red">
            {uz ? "Havola mavjud emas." : "Ссылка недоступна."}
          </Alert>
        )}
        {(failed || (result && !result.available)) && (
          <Button
            component={Link}
            to={result?.path || "/login"}
            leftSection={<IconLogin size={18} />}
            style={{ alignSelf: "flex-start" }}
          >
            {uz ? "Hisobga kirish" : "Войти в аккаунт"}
          </Button>
        )}
      </Stack>
    </Container>
  );
}
