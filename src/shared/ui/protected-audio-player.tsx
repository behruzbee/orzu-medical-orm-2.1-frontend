import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Alert,
  Group,
  Progress,
  Slider,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconRefresh,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import axios, { isAxiosError } from "axios";
import { api } from "@/shared/api/api";
import { useTranslation } from "@/shared/i18n";

type Props = {
  source: string;
  feedbackId: string;
  id: string;
  scope?: "archive" | "current";
  guestToken?: string;
  onConsumed?: () => void;
};
export const guestAudioApi = axios.create({ baseURL: api.defaults.baseURL });
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export function ProtectedAudioPlayer({
  source,
  feedbackId,
  id,
  scope = "archive",
  guestToken,
  onConsumed,
}: Props) {
  const { language } = useTranslation();
  const uz = language === "uz";
  const engine = useRef<
    | {
        context: AudioContext;
        gain: GainNode;
        buffer?: AudioBuffer;
        node?: AudioBufferSourceNode;
        offset: number;
        started: number;
      }
    | undefined
  >(undefined);
  const request = useRef<AbortController | undefined>(undefined);
  const [state, setState] = useState<
    "ready" | "loading" | "playing" | "paused" | "ended" | "error"
  >("ready");
  const [error, setError] = useState(0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);

  const dispose = () => {
    request.current?.abort();
    const current = engine.current;
    engine.current = undefined;
    if (current?.node) {
      current.node.onended = null;
      current.node.stop();
      current.node.disconnect();
    }
    if (current) {
      current.buffer = undefined;
      current.gain.disconnect();
      void current.context.close();
    }
  };

  const pause = () => {
    const current = engine.current;
    if (!current?.node) return;
    current.offset = Math.min(
      current.buffer?.duration || 0,
      current.offset + current.context.currentTime - current.started,
    );
    current.node.onended = null;
    current.node.stop();
    current.node.disconnect();
    current.node = undefined;
    void current.context.suspend();
    setPosition(current.offset);
    setState("paused");
  };

  useEffect(() => {
    const hide = () => {
      if (document.hidden) pause();
    };
    const leave = () => {
      dispose();
      setState("ended");
    };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", leave);
    return () => {
      dispose();
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("pagehide", leave);
    };
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    const timer = window.setInterval(() => {
      const current = engine.current;
      if (current)
        setPosition(
          Math.min(
            current.buffer?.duration || 0,
            current.offset + current.context.currentTime - current.started,
          ),
        );
    }, 250);
    return () => window.clearInterval(timer);
  }, [state]);

  const play = async () => {
    if (state === "loading" || state === "playing") return;
    setState("loading");
    setError(0);
    const controller = new AbortController();
    request.current = controller;
    try {
      if (!engine.current) {
        const context = new AudioContext();
        const gain = context.createGain();
        gain.gain.value = volume / 100;
        gain.connect(context.destination);
        engine.current = { context, gain, offset: 0, started: 0 };
        await context.resume();
        const options = {
          signal: controller.signal,
          headers: { "X-Audio-Playback": "1" },
        };
        let data: ArrayBuffer;
        if (guestToken) {
          ({ data } = await guestAudioApi.post<ArrayBuffer>(
            "/audio-guest/play",
            { token: guestToken },
            { ...options, responseType: "arraybuffer" },
          ));
        } else {
          const { data: ticket } = await api.post<{ token: string }>(
            `/audio-playback/${scope}/tickets`,
            { source, feedbackId, id },
            options,
          );
          ({ data } = await api.post<ArrayBuffer>(
            "/audio-playback/play",
            { token: ticket.token },
            { ...options, responseType: "arraybuffer" },
          ));
          ticket.token = "";
        }
        if (controller.signal.aborted) return;
        const decoded = await context.decodeAudioData(data);
        if (controller.signal.aborted || !engine.current) return;
        engine.current.buffer = decoded;
        setDuration(decoded.duration);
        setPosition(0);
      }
      const current = engine.current;
      if (!current?.buffer || controller.signal.aborted) return;
      await current.context.resume();
      if (controller.signal.aborted) return;
      const node = current.context.createBufferSource();
      node.buffer = current.buffer;
      node.connect(current.gain);
      current.node = node;
      current.started = current.context.currentTime;
      node.onended = () => {
        const end = current.buffer?.duration || 0;
        dispose();
        setPosition(end);
        setState("ended");
        onConsumed?.();
      };
      node.start(0, current.offset);
      setState("playing");
      if (document.hidden) pause();
    } catch (failure) {
      if (controller.signal.aborted) return;
      dispose();
      setState("error");
      setError(isAxiosError(failure) ? failure.response?.status || 500 : 500);
      if (guestToken) onConsumed?.();
    }
  };

  const label =
    state === "playing"
      ? uz
        ? "Pauza"
        : "Пауза"
      : state === "ended"
        ? uz
          ? "Qayta tinglash"
          : "Прослушать снова"
        : uz
          ? "Tinglash"
          : "Слушать";
  return (
    <Stack
      gap="xs"
      w="100%"
      maw={640}
      miw={0}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Group gap="sm" wrap="nowrap">
        <Tooltip label={label}>
          <ActionIcon
            aria-label={label}
            size={40}
            variant="light"
            loading={state === "loading"}
            onClick={state === "playing" ? pause : play}
            style={{ flexShrink: 0 }}
          >
            {state === "playing" ? (
              <IconPlayerPause size={20} />
            ) : state === "ended" ? (
              <IconRefresh size={20} />
            ) : (
              <IconPlayerPlay size={20} />
            )}
          </ActionIcon>
        </Tooltip>
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Progress
            value={duration ? (position / duration) * 100 : 0}
            aria-label={uz ? "Ijro" : "Воспроизведение"}
          />
          <Text
            size="xs"
            c="dimmed"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {clock(position)} / {clock(duration)}
          </Text>
        </Stack>
        <Tooltip label={uz ? "Ovoz" : "Громкость"}>
          <ActionIcon
            aria-label={uz ? "Ovoz" : "Громкость"}
            variant="subtle"
            onClick={() => {
              const next = volume ? 0 : 80;
              setVolume(next);
              if (engine.current) engine.current.gain.gain.value = next / 100;
            }}
          >
            {volume ? <IconVolume size={20} /> : <IconVolumeOff size={20} />}
          </ActionIcon>
        </Tooltip>
        <Slider
          aria-label={uz ? "Ovoz balandligi" : "Уровень громкости"}
          value={volume}
          onChange={(next) => {
            setVolume(next);
            if (engine.current) engine.current.gain.gain.value = next / 100;
          }}
          w={64}
          style={{ flexShrink: 0 }}
        />
      </Group>
      {state === "error" && (
        <Alert color="red">
          {error === 401 || error === 403
            ? uz
              ? "Kirish uchun ruxsat kerak."
              : "Требуется вход и разрешение на доступ."
            : error === 429
              ? uz
                ? "Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring."
                : "Слишком много попыток. Повторите через минуту."
              : uz
                ? "Audioni ijro etib bo'lmadi."
                : "Не удалось воспроизвести аудио."}
        </Alert>
      )}
    </Stack>
  );
}
