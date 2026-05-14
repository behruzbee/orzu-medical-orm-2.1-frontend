import { useState, useEffect, useRef } from "react";
import {
  Modal,
  Stack,
  Text,
  Group,
  Rating,
  Button,
  Paper,
  Divider,
  ScrollArea,
  Box,
  ThemeIcon,
  ActionIcon,
  Image,
  Tabs,
  FileButton,
  TextInput,
  Badge,
  Overlay,
  Center,
  Checkbox,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconPlayerPlay,
  IconPlayerPause,
  IconPhoto,
  IconMicrophone,
  IconPaperclip,
  IconTrash,
  IconDeviceFloppy,
  IconVideo,
  IconFileText,
  IconUpload,
} from "@tabler/icons-react";
import type { IMessage } from "@/entities/chat";

// --- ТИПЫ ---
interface ComplaintPayload {
  ratings: Record<string, number>;
  evidenceMessages: any[];
  sendToTrello?: boolean;
  createdAt: string;
}

interface Props {
  opened: boolean;
  onClose: () => void;
  selectedMessages: IMessage[];
  onSubmit: (payload: ComplaintPayload) => void;
  isLoading?: boolean;
}

// Утилита для конвертации в Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const CATEGORIES = [
  { id: "doctors", label: "Shifokorlar" },
  { id: "nurses", label: "Hamshiralar" },
  { id: "cleanliness", label: "Tozalik" },
  { id: "food", label: "Oshxona" },
  { id: "reception", label: "Registratura xodimlari" },
  { id: "clinic", label: "Klinika to'grisida" },
];

const DEFAULT_RATINGS = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = 5;
    return acc;
  },
  {} as Record<string, number>,
);

const DEFAULT_TEXT = "Bemor bilan bog'lanildi va natijadan mamnun.";

export const ComplaintModal = ({
  opened,
  onClose,
  selectedMessages,
  onSubmit,
  isLoading = false,
}: Props) => {
  const [ratings, setRatings] =
    useState<Record<string, number>>(DEFAULT_RATINGS);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- MANUAL INPUT STATE ---
  const [manualText, setManualText] = useState(DEFAULT_TEXT);
  const [manualEvidence, setManualEvidence] = useState<IMessage[]>([]);
  const [sendToTrello, setSendToTrello] = useState(false);

  // --- DRAG AND DROP STATE ---
  const [isDragging, setIsDragging] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (opened) {
      setRatings(DEFAULT_RATINGS);
      setManualEvidence([]);
      setManualText(DEFAULT_TEXT);
      setRecordingTime(0);
      setIsRecording(false);
      setIsDragging(false);
    } else {
      stopPlaying();
      stopRecording();
    }
  }, [opened]);

  // --- ЛОГИКА DRAG AND DROP ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Agar kursor oynaning ichidagi boshqa elementga o'tgan bo'lsa, yopmaslik uchun tekshiruv
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      for (const file of files) {
        await handleFileUpload(file);
      }
    }
  };

  // --- ЛОГИКА АУДИО ПЛЕЕРА ---
  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    }
  };

  const handlePlayAudio = (url: string | undefined, id: string) => {
    if (!url) return;
    if (playingAudioId === id) {
      stopPlaying();
      return;
    }
    stopPlaying();
    const newAudio = new Audio(url);
    newAudio.onended = () => setPlayingAudioId(null);
    audioRef.current = newAudio;
    newAudio.play().catch((e) => console.error("Audio play error:", e));
    setPlayingAudioId(id);
  };

  // --- ЛОГИКА ЗАПИСИ ГОЛОСА ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mimeType = "audio/webm";
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const audioFile = new File(
          [audioBlob],
          `voice_note_${Date.now()}.webm`,
          {
            type: mimeType,
          },
        );
        const base64 = await fileToBase64(audioFile);

        addManualEvidence({
          type: "audio",
          mediaUrl: base64,
          duration: formatTime(recordingTime),
          text: "Operator ovozli izohi",
        });

        setRecordingTime(0);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Mikrofonga ruxsat berilmadi!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // --- ЛОГИКА ФАЙЛОВ И ТЕКСТА ---
  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);

      let type: IMessage["type"] = "document";

      if (file.type.startsWith("image/")) {
        type = "image";
      } else if (file.type.startsWith("video/")) {
        type = "video";
      } else if (file.type.startsWith("audio/")) {
        type = "audio";
      }

      addManualEvidence({
        type: type,
        mediaUrl: base64,
        text: file.name,
      });
    } catch (e) {
      console.error("File upload error", e);
    }
  };

  const handleAddTextNote = () => {
    if (!manualText.trim()) return;
    addManualEvidence({
      type: "text",
      text: manualText,
    });
    setManualText("");
  };

  const addManualEvidence = (item: Partial<IMessage>) => {
    const newItem: IMessage = {
      // Unikal ID yaratish (birdaniga bir nechta fayl tushganda xato bermasligi uchun)
      id: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sender: "operator",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "read",
      type: "text",
      // @ts-ignore
      source: "manual",
      ...item,
    } as IMessage;

    setManualEvidence((prev) => [...prev, newItem]);
  };

  const removeManualItem = (id: string) => {
    if (playingAudioId === id) stopPlaying();
    setManualEvidence((prev) => prev.filter((i) => i.id !== id));
  };

  const isAllOk = CATEGORIES.every((cat) => ratings[cat.id] === 5);

  const handleSubmit = () => {
    stopPlaying();

    const combinedEvidence = [
      ...selectedMessages.map((m) => ({ ...m, source: "whatsapp" })),
      ...manualEvidence.map((m) => ({ ...m, source: "manual" })),
    ];

    if (combinedEvidence.length === 0 && manualText.trim()) {
      combinedEvidence.push({
        id: `manual-auto-${Date.now()}`,
        sender: "operator",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "read",
        type: "text",
        source: "manual",
        text: manualText,
      } as any);
    }

    onSubmit({
      ratings: ratings,
      evidenceMessages: combinedEvidence,
      createdAt: new Date().toISOString(),
      sendToTrello: isAllOk ? sendToTrello : undefined, // 👈 ДОБАВЛЕНО
    });
  };

  const renderMessageContent = (msg: IMessage, isManual = false) => {
    const isPlaying = playingAudioId === msg.id;

    const content = () => {
      switch (msg.type) {
        case "audio":
          return (
            <Group gap="xs" wrap="nowrap">
              <ActionIcon
                variant="filled"
                color={isPlaying ? "red" : "blue"}
                radius="xl"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio(msg.mediaUrl, msg.id);
                }}
              >
                {isPlaying ? (
                  <IconPlayerPause size={14} />
                ) : (
                  <IconPlayerPlay size={14} />
                )}
              </ActionIcon>
              <Stack gap={0}>
                <Text size="sm" fw={500} style={{ lineHeight: 1 }}>
                  Ovozli xabar
                </Text>
                <Text size="xs" c="dimmed">
                  {isPlaying ? "Eshittirilmoqda..." : msg.duration || "0:00"}
                </Text>
              </Stack>
            </Group>
          );
        case "image":
          return (
            <Stack gap={6}>
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="violet" radius="xl">
                  <IconPhoto size={12} />
                </ThemeIcon>
                <Text size="sm" fw={500}>
                  Rasm
                </Text>
              </Group>
              {msg.mediaUrl && (
                <Box
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #eee",
                    maxWidth: 120,
                  }}
                >
                  <Image src={msg.mediaUrl} h={80} w="auto" fit="cover" />
                </Box>
              )}
            </Stack>
          );
        case "video":
          return (
            <Stack gap={6}>
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="orange" radius="xl">
                  <IconVideo size={12} />
                </ThemeIcon>
                <Text size="sm" fw={500}>
                  Video
                </Text>
              </Group>
              {msg.mediaUrl && (
                <Box
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    maxWidth: 120,
                    background: "#000",
                  }}
                >
                  <video
                    src={msg.mediaUrl}
                    style={{ width: "100%", display: "block" }}
                  />
                </Box>
              )}
            </Stack>
          );

        case "document":
        default:
          if (msg.mediaUrl) {
            return (
              <Stack gap={6}>
                <Group gap="xs">
                  <ThemeIcon size="sm" variant="light" color="blue" radius="xl">
                    <IconFileText size={12} />
                  </ThemeIcon>
                  <Text size="sm" fw={500}>
                    Fayl
                  </Text>
                </Group>
                <Paper withBorder p="xs" bg="white" radius="sm">
                  <Group gap="xs" wrap="nowrap">
                    <IconFileText size={20} color="gray" />
                    <Text
                      size="xs"
                      lineClamp={2}
                      style={{ wordBreak: "break-all" }}
                    >
                      {msg.text || "Fayl nomi yo'q"}
                    </Text>
                  </Group>
                </Paper>
              </Stack>
            );
          }
          return (
            <Text size="sm" lineClamp={3} style={{ fontStyle: "italic" }}>
              "{msg.text}"
            </Text>
          );
      }
    };

    return (
      <Group justify="space-between" align="flex-start" wrap="nowrap" w="100%">
        <Box style={{ flex: 1 }}>{content()}</Box>
        {isManual && (
          <ActionIcon
            color="red"
            variant="subtle"
            size="sm"
            onClick={() => removeManualItem(msg.id)}
          >
            <IconTrash size={14} />
          </ActionIcon>
        )}
      </Group>
    );
  };

  const isFormValid = CATEGORIES.every((cat) => (ratings[cat.id] || 0) > 0);
  const totalEvidenceCount =
    selectedMessages.length +
    manualEvidence.length +
    (manualText.trim() ? 1 : 0);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconAlertTriangle size={20} color="red" />
          <Text fw={700} size="lg">
            Ma'lumotni rasmiylashtirish
          </Text>
        </Group>
      }
      centered
      size="lg"
      radius="md"
      closeOnClickOutside={false}
      styles={{ content: { position: "relative" } }}
    >
      {/* DRAG AND DROP KONTENYERI */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ position: "relative" }}
      >
        {isDragging && (
          <Overlay
            color="#fff"
            backgroundOpacity={0.85}
            zIndex={1000}
            radius="md"
            style={{
              border: "2px dashed var(--mantine-color-blue-5)",
              margin: 4,
            }}
          >
            <Center h="100%">
              <Stack align="center" gap="xs">
                <ThemeIcon size={60} radius="xl" variant="light">
                  <IconUpload size={34} />
                </ThemeIcon>
                <Text fw={600} size="lg">
                  Fayllarni shu yerga tashlang
                </Text>
                <Text size="sm" c="dimmed">
                  Rasm, video yoki hujjat
                </Text>
              </Stack>
            </Center>
          </Overlay>
        )}

        <Stack gap="md">
          <Tabs defaultValue="list" variant="outline">
            <Tabs.List mb="xs">
              <Tabs.Tab value="list" leftSection={<IconCheck size={14} />}>
                Tanlangan ({selectedMessages.length})
              </Tabs.Tab>
              <Tabs.Tab
                value="manual"
                leftSection={<IconDeviceFloppy size={14} />}
              >
                Qo'shimcha dalillar ({manualEvidence.length})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="list">
              {selectedMessages.length === 0 ? (
                <Text c="dimmed" fs="italic" size="sm" py="md" ta="center">
                  Chatdan hech narsa tanlanmagan
                </Text>
              ) : (
                <ScrollArea.Autosize mah={250} type="auto" offsetScrollbars>
                  <Stack gap="xs">
                    {selectedMessages.map((msg) => (
                      <Paper
                        key={msg.id}
                        withBorder
                        p="xs"
                        bg="gray.0"
                        radius="sm"
                        style={{
                          borderLeft: "4px solid var(--mantine-color-blue-6)",
                        }}
                      >
                        <Group justify="space-between" mb={6}>
                          <Text
                            size="xs"
                            fw={700}
                            c={msg.sender === "patient" ? "blue.7" : "green.7"}
                          >
                            {msg.sender === "patient"
                              ? "Bemor (WhatsApp)"
                              : "Operator"}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {msg.timestamp}
                          </Text>
                        </Group>
                        {renderMessageContent(msg)}
                      </Paper>
                    ))}
                  </Stack>
                </ScrollArea.Autosize>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="manual">
              <Stack gap="md">
                <Paper withBorder p="xs" bg="gray.0" radius="md">
                  <Stack gap="xs">
                    <Group gap="xs">
                      <TextInput
                        placeholder="Izoh yozing..."
                        style={{ flex: 1 }}
                        size="xs"
                        value={manualText}
                        onChange={(e) => setManualText(e.currentTarget.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddTextNote()
                        }
                      />
                      <Button
                        size="xs"
                        variant="white"
                        onClick={handleAddTextNote}
                        disabled={!manualText}
                      >
                        Qo'shish
                      </Button>
                    </Group>

                    <Divider
                      label="Yoki fayl yuklang (Drag & Drop ishlaydi)"
                      labelPosition="center"
                      my={5}
                    />

                    <Group grow>
                      <FileButton onChange={handleFileUpload}>
                        {(props) => (
                          <Button
                            {...props}
                            variant="light"
                            size="xs"
                            leftSection={<IconPaperclip size={14} />}
                          >
                            Fayl yuklash (Foto/Video/Hujjat)
                          </Button>
                        )}
                      </FileButton>

                      {isRecording ? (
                        <Button
                          color="red"
                          size="xs"
                          onClick={stopRecording}
                          leftSection={<IconPlayerPause size={14} />}
                          className="blink"
                        >
                          To'xtatish ({formatTime(recordingTime)})
                        </Button>
                      ) : (
                        <Button
                          color="red"
                          variant="light"
                          size="xs"
                          onClick={startRecording}
                          leftSection={<IconMicrophone size={14} />}
                        >
                          Ovoz yozish
                        </Button>
                      )}
                    </Group>
                  </Stack>
                </Paper>

                <ScrollArea.Autosize mah={200}>
                  <Stack gap="xs">
                    {manualEvidence.length === 0 && (
                      <Text size="xs" c="dimmed" ta="center">
                        Hozircha qo'shimcha dalillar yo'q
                      </Text>
                    )}
                    {manualEvidence.map((msg) => (
                      <Paper
                        key={msg.id}
                        withBorder
                        p="xs"
                        radius="sm"
                        style={{
                          borderLeft: "4px solid var(--mantine-color-orange-6)",
                        }}
                      >
                        <Group justify="space-between" mb={2}>
                          <Badge size="xs" color="orange" variant="light">
                            Manual
                          </Badge>
                          <Text size="xs" c="dimmed">
                            {msg.timestamp}
                          </Text>
                        </Group>
                        {renderMessageContent(msg, true)}
                      </Paper>
                    ))}
                  </Stack>
                </ScrollArea.Autosize>
              </Stack>
            </Tabs.Panel>
          </Tabs>

          <Divider label="Xizmat sifatini baholang" labelPosition="center" />

          <Stack gap="xs">
            {CATEGORIES.map((cat) => {
              const currentRating = ratings[cat.id] || 0;
              return (
                <Group
                  key={cat.id}
                  justify="space-between"
                  p="xs"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <Text size="sm" fw={500}>
                    {cat.label}
                  </Text>
                  <Rating
                    size="md"
                    value={currentRating}
                    onChange={(value) =>
                      setRatings((p) => ({ ...p, [cat.id]: value }))
                    }
                  />
                </Group>
              );
            })}
          </Stack>

          {isAllOk && (
            <Box bg="blue.0" p="sm" style={{ borderRadius: 8 }}>
              <Checkbox
                label="Trelloga 'Taklif' sifatida yuborish"
                description="Bemorning ijobiy fikrini Trelloga qo'shish uchun belgilang"
                checked={sendToTrello}
                onChange={(event) =>
                  setSendToTrello(event.currentTarget.checked)
                }
                color="blue"
              />
            </Box>
          )}

          <Group grow mt="md">
            <Button variant="light" color="gray" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button
              color="red.7"
              size="md"
              onClick={handleSubmit}
              disabled={!isFormValid || totalEvidenceCount === 0 || isLoading}
              loading={isLoading} // 👈 Крутилка загрузки
            >
              Saqlash ({totalEvidenceCount} dalil)
            </Button>
          </Group>
        </Stack>
      </Box>
      <style>{`.blink { animation: blinker 1.5s linear infinite; } @keyframes blinker { 50% { opacity: 0.5; } }`}</style>
    </Modal>
  );
};
