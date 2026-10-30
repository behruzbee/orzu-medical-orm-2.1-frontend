import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import { api } from "@/shared/api/api";
import { useTranslation } from "@/shared/i18n";
import { ProtectedAudioPlayer } from "@/shared/ui/protected-audio-player";
import { AudioShareControls } from "@/shared/ui/audio-share-controls";

type Evidence = {
  id: string;
  feedbackId: string;
  patientId: string | null;
  patientName: string | null;
  branch: string | null;
  mimeType: string | null;
  bytes: number;
  source: string;
  evidenceType?: string;
};

export function ArchiveEvidencePage() {
  const { source, feedbackId, id } = useParams();
  const { language } = useTranslation();
  const uz = language === "uz";
  const [retry, setRetry] = useState(0);
  const key = `${source}/${feedbackId}/${id}/${retry}`;
  const [result, setResult] = useState<{
    key: string;
    evidence?: Evidence;
    url?: string;
    mimeType?: string;
    error?: number;
  }>();

  useEffect(() => {
    const controller = new AbortController();
    let blobUrl: string | undefined;
    const path = `/archive/${encodeURIComponent(source || "")}/feedbacks/${encodeURIComponent(feedbackId || "")}/evidence/${encodeURIComponent(id || "")}`;
    (async () => {
      try {
        const { data: evidence } = await api.get<Evidence>(path, {
          signal: controller.signal,
        });
        if (
          evidence.evidenceType === "audio" ||
          evidence.mimeType?.startsWith("audio/")
        ) {
          if (!controller.signal.aborted)
            setResult({
              key,
              evidence,
              mimeType: evidence.mimeType || "audio/unknown",
            });
          return;
        }
        const { data } = await api.get<Blob>(`${path}/file`, {
          responseType: "blob",
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        blobUrl = URL.createObjectURL(data);
        setResult({ key, evidence, url: blobUrl, mimeType: data.type });
      } catch (error) {
        if (!controller.signal.aborted)
          setResult({
            key,
            error: isAxiosError(error) ? error.response?.status || 500 : 500,
          });
      }
    })();
    return () => {
      controller.abort();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [key, source, feedbackId, id]);

  if (result?.key !== key)
    return <Loader aria-label={uz ? "Yuklanmoqda" : "Загрузка"} />;
  if (result.error || !result.evidence) {
    return (
      <Stack maw={640}>
        <Alert color="red" title={uz ? "Arxiv fayli" : "Архивное вложение"}>
          {result.error === 403
            ? uz
              ? "Faqat administrator uchun ruxsat berilgan."
              : "Доступ разрешён только администратору."
            : result.error === 404 || result.error === 400
              ? uz
                ? "Ushbu murojaatning fayli topilmadi."
                : "Вложение этого обращения не найдено."
              : uz
                ? "Faylni yuklab bo'lmadi."
                : "Не удалось загрузить файл."}
        </Alert>
        <Button
          variant="default"
          leftSection={<IconRefresh size={16} />}
          onClick={() => setRetry((value) => value + 1)}
        >
          {uz ? "Qayta urinish" : "Повторить"}
        </Button>
      </Stack>
    );
  }
  const { evidence, url, mimeType = "" } = result;
  const download = uz ? "Yuklab olish" : "Скачать";
  return (
    <Stack gap="lg" maw={900}>
      <Group justify="space-between" wrap="wrap">
        <Title order={2} size="h3">
          {uz ? "Arxiv fayli" : "Архивное вложение"}
        </Title>
        <Badge variant="light" color="gray">
          {source === "v21" ? "2.1" : source === "v2" ? "2.0" : "1.0"}
        </Badge>
      </Group>
      <Stack gap={4}>
        <Text fw={600} style={{ overflowWrap: "anywhere" }}>
          {evidence.patientName || (uz ? "Bemor" : "Пациент")}
        </Text>
        {evidence.branch && (
          <Text size="sm" c="dimmed">
            {evidence.branch}
          </Text>
        )}
        <Text size="xs" c="dimmed" style={{ overflowWrap: "anywhere" }}>
          FeedbackID: {evidence.feedbackId}
        </Text>
        <Text size="xs" c="dimmed" style={{ overflowWrap: "anywhere" }}>
          FileID: {evidence.id}
        </Text>
      </Stack>
      {(evidence.evidenceType === "audio" || mimeType.startsWith("audio/")) && (
        <ProtectedAudioPlayer
          key={`${source}/${feedbackId}/${id}`}
          source={source!}
          feedbackId={feedbackId!}
          id={id!}
        />
      )}
      {mimeType.startsWith("video/") && (
        <video
          controls
          preload="metadata"
          src={url}
          style={{ width: "100%", maxHeight: 480 }}
        />
      )}
      {mimeType.startsWith("image/") && (
        <img
          alt={uz ? "Arxiv fayli" : "Архивное вложение"}
          src={url}
          style={{ maxWidth: "100%", maxHeight: 480, objectFit: "contain" }}
        />
      )}
      <Group>
        {url && (
          <Tooltip label={download}>
            <ActionIcon
              component="a"
              href={url}
              download={`${source}-${id}`}
              aria-label={download}
              variant="light"
              size="lg"
            >
              <IconDownload size={20} />
            </ActionIcon>
          </Tooltip>
        )}
        <Text size="sm" c="dimmed">
          {(evidence.bytes / 1024).toFixed(1)} KB
        </Text>
      </Group>
      {(evidence.evidenceType === "audio" || mimeType.startsWith("audio/")) && (
        <AudioShareControls
          key={`share-${source}-${feedbackId}-${id}`}
          source={source!}
          feedbackId={feedbackId!}
          id={id!}
        />
      )}
    </Stack>
  );
}
