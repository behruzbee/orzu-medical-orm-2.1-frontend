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
  Select,
  Alert,
  Loader,
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
  IconPlus,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { IMessage } from "@/entities/chat";
import { feedbackApi, type FeedbackType } from "@/entities/feedback";
import { useTranslation } from "@/shared/i18n";

type ComplaintEvidence = IMessage & { source?: "whatsapp" | "manual" };

interface ComplaintPayload {
  type: "complaint" | "suggestion";
  category: string;
  subcategory: string;
  ratings: Record<string, number>;
  evidenceMessages: ComplaintEvidence[];
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

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const CATEGORIES = [
  { id: "doctors", uz: "Shifokorlar", ru: "Врачи" },
  { id: "nurses", uz: "Hamshiralar", ru: "Медсёстры" },
  { id: "cleanliness", uz: "Tozalik", ru: "Чистота" },
  { id: "food", uz: "Oshxona", ru: "Питание" },
  { id: "reception", uz: "Registratura xodimlari", ru: "Регистратура" },
  { id: "clinic", uz: "Klinika to'g'risida", ru: "О клинике" },
];

const DEFAULT_RATINGS = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = 5;
    return acc;
  },
  {} as Record<string, number>,
);

export const ComplaintModal = ({
  opened,
  onClose,
  selectedMessages,
  onSubmit,
  isLoading = false,
}: Props) => {
  const { tr } = useTranslation();
  const [ratings, setRatings] =
    useState<Record<string, number>>(DEFAULT_RATINGS);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [manualText, setManualText] = useState("");
  const [manualEvidence, setManualEvidence] = useState<ComplaintEvidence[]>([]);
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (opened) {
      setRatings(DEFAULT_RATINGS);
      setManualEvidence([]);
      setManualText("");
      setRecordingTime(0);
      setIsRecording(false);
      setIsDragging(false);
      setFeedbackType(null);
      setCategory(null);
      setSubcategory(null);
      setCustomSubcategory("");
      setIsCustomSubcategory(false);
    } else {
      audioRef.current?.pause();
      setPlayingAudioId(null);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [opened]);

  const { data: subcategories = [], isFetching: isLoadingSubcategories } =
    useQuery({
      queryKey: ["feedback-subcategories", feedbackType, category],
      queryFn: () => feedbackApi.getSubcategories(feedbackType!, category!),
      enabled: opened && Boolean(feedbackType && category),
      staleTime: 30_000,
    });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
          text: tr("Operator ovozli izohi", "Голосовая заметка оператора"),
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
      alert(tr("Mikrofonga ruxsat berilmadi!", "Нет доступа к микрофону!"));
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
      console.error("Fayl yuklashda xatolik", e);
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

  const addManualEvidence = (item: Partial<ComplaintEvidence>) => {
    const newItem: ComplaintEvidence = {
      id: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sender: "operator",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "read",
      type: "text",
      source: "manual",
      ...item,
    };

    setManualEvidence((prev) => [...prev, newItem]);
  };

  const removeManualItem = (id: string) => {
    if (playingAudioId === id) stopPlaying();
    setManualEvidence((prev) => prev.filter((i) => i.id !== id));
  };

  const isFormValid = CATEGORIES.every((cat) => (ratings[cat.id] || 0) > 0);

  const totalEvidenceCount =
    selectedMessages.length +
    manualEvidence.length +
    (manualText.trim() ? 1 : 0);

  const selectedSubcategory = isCustomSubcategory
    ? customSubcategory.trim()
    : subcategory;

  const handleSubmit = () => {
    if (!feedbackType || !category || !selectedSubcategory) return;
    stopPlaying();

    const combinedEvidence: ComplaintEvidence[] = [
      ...selectedMessages.map(
        (message): ComplaintEvidence => ({ ...message, source: "whatsapp" }),
      ),
      ...manualEvidence.map(
        (message): ComplaintEvidence => ({ ...message, source: "manual" }),
      ),
    ];

    if (manualText.trim()) {
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
      });
    }

    onSubmit({
      type: feedbackType,
      category,
      subcategory: selectedSubcategory,
      ratings: ratings,
      evidenceMessages: combinedEvidence,
      createdAt: new Date().toISOString(),
      sendToTrello: true,
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
                  {tr("Ovozli xabar", "Голосовое сообщение")}
                </Text>
                <Text size="xs" c="dimmed">
                  {isPlaying
                    ? tr("Eshittirilmoqda...", "Воспроизводится...")
                    : msg.duration || "0:00"}
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
                  {tr("Rasm", "Изображение")}
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
                  {tr("Video", "Видео")}
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
                    {tr("Fayl", "Файл")}
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
                      {msg.text || tr("Fayl nomi yo'q", "Файл без названия")}
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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconAlertTriangle size={20} color="red" />
          <Text fw={700} size="lg">
            {tr("Ma'lumotni rasmiylashtirish", "Оформление обращения")}
          </Text>
        </Group>
      }
      centered
      size="lg"
      radius="md"
      closeOnClickOutside={false}
      styles={{ content: { position: "relative" } }}
    >
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
                  {tr("Fayllarni shu yerga tashlang", "Перетащите файлы сюда")}
                </Text>
                <Text size="sm" c="dimmed">
                  {tr(
                    "Rasm, video yoki hujjat",
                    "Изображение, видео или документ",
                  )}
                </Text>
              </Stack>
            </Center>
          </Overlay>
        )}

        <Stack gap="md">
          <Tabs defaultValue="list" variant="outline">
            <Tabs.List mb="xs">
              <Tabs.Tab value="list" leftSection={<IconCheck size={14} />}>
                {tr("Tanlangan", "Выбрано")} ({selectedMessages.length})
              </Tabs.Tab>
              <Tabs.Tab
                value="manual"
                leftSection={<IconDeviceFloppy size={14} />}
              >
                {tr("Qo'shimcha dalillar", "Дополнительные материалы")} (
                {manualEvidence.length})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="list">
              {selectedMessages.length === 0 ? (
                <Text c="dimmed" fs="italic" size="sm" py="md" ta="center">
                  {tr(
                    "Chatdan hech narsa tanlanmagan",
                    "В чате ничего не выбрано",
                  )}
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
                              ? tr("Bemor (WhatsApp)", "Пациент (WhatsApp)")
                              : tr("Operator", "Оператор")}
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
                        placeholder={tr(
                          "Izoh yozing...",
                          "Введите комментарий...",
                        )}
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
                        {tr("Qo'shish", "Добавить")}
                      </Button>
                    </Group>

                    <Divider
                      label={tr(
                        "Yoki fayl yuklang (Drag & Drop ishlaydi)",
                        "Или загрузите файл (можно перетащить)",
                      )}
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
                            {tr(
                              "Fayl yuklash (Foto/Video/Hujjat)",
                              "Загрузить файл (фото/видео/документ)",
                            )}
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
                          {tr("To'xtatish", "Остановить")} (
                          {formatTime(recordingTime)})
                        </Button>
                      ) : (
                        <Button
                          color="red"
                          variant="light"
                          size="xs"
                          onClick={startRecording}
                          leftSection={<IconMicrophone size={14} />}
                        >
                          {tr("Ovoz yozish", "Записать голос")}
                        </Button>
                      )}
                    </Group>
                  </Stack>
                </Paper>

                <ScrollArea.Autosize mah={200}>
                  <Stack gap="xs">
                    {manualEvidence.length === 0 && (
                      <Text size="xs" c="dimmed" ta="center">
                        {tr(
                          "Hozircha qo'shimcha dalillar yo'q",
                          "Дополнительных материалов пока нет",
                        )}
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
                            {tr("Qo'lda", "Вручную")}
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

          <Divider
            label={tr("Xizmat sifatini baholang", "Оцените качество услуг")}
            labelPosition="center"
          />

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
                    {tr(cat.uz, cat.ru)}
                  </Text>
                  <Rating
                    size="md"
                    value={currentRating}
                    onChange={(value) =>
                      // 🔥 ОБНОВЛЕНИЕ: Ограничиваем минимальное значение до 2 звезд
                      setRatings((p) => ({
                        ...p,
                        [cat.id]: Math.max(2, value),
                      }))
                    }
                  />
                </Group>
              );
            })}
          </Stack>

          <Divider
            label={tr("Murojaatni tasniflang", "Классификация обращения")}
            labelPosition="center"
          />

          <Paper withBorder p="md" radius="md" bg="gray.0">
            <Stack gap="sm">
              <Select
                required
                clearable
                label={tr("Murojaat turi", "Тип обращения")}
                placeholder={tr("Turini tanlang", "Выберите тип")}
                data={[
                  { value: "complaint", label: tr("Shikoyat", "Жалоба") },
                  { value: "suggestion", label: tr("Taklif", "Предложение") },
                ]}
                value={feedbackType}
                onChange={(value) => {
                  setFeedbackType(value as FeedbackType | null);
                  setSubcategory(null);
                  setCustomSubcategory("");
                  setIsCustomSubcategory(false);
                }}
              />

              <Select
                required
                clearable
                searchable
                label={tr("Kategoriya", "Категория")}
                placeholder={tr("Kategoriyani tanlang", "Выберите категорию")}
                data={CATEGORIES.map((item) => ({
                  value: item.id,
                  label: tr(item.uz, item.ru),
                }))}
                value={category}
                onChange={(value) => {
                  setCategory(value);
                  setSubcategory(null);
                  setCustomSubcategory("");
                  setIsCustomSubcategory(false);
                }}
              />

              <Select
                required
                clearable
                searchable
                disabled={!feedbackType || !category}
                label={tr("Ichki kategoriya", "Подкатегория")}
                description={tr(
                  "Takroriy murojaatlar aynan shu qiymat bo'yicha hisoblanadi",
                  "Повторные обращения определяются по этому значению",
                )}
                placeholder={
                  !feedbackType || !category
                    ? tr(
                        "Avval tur va kategoriyani tanlang",
                        "Сначала выберите тип и категорию",
                      )
                    : tr("Bo'sh — qiymatni tanlang", "Выберите значение")
                }
                nothingFoundMessage={tr(
                  "Mos variant topilmadi",
                  "Подходящий вариант не найден",
                )}
                data={[
                  ...subcategories.map((item) => ({
                    value: item.name,
                    label: item.name,
                  })),
                  {
                    value: "__custom__",
                    label: tr(
                      "+ Yangi variant qo'shish",
                      "+ Добавить новый вариант",
                    ),
                  },
                ]}
                value={isCustomSubcategory ? "__custom__" : subcategory}
                onChange={(value) => {
                  const isCustom = value === "__custom__";
                  setIsCustomSubcategory(isCustom);
                  setSubcategory(isCustom ? null : value);
                  if (!isCustom) setCustomSubcategory("");
                }}
                rightSection={
                  isLoadingSubcategories ? <Loader size="xs" /> : undefined
                }
              />

              {isCustomSubcategory && (
                <TextInput
                  required
                  autoFocus
                  maxLength={160}
                  label={tr("Yangi podkategoriya", "Новая подкатегория")}
                  placeholder={tr(
                    "Masalan: smesitel ishlamaydi",
                    "Например: не работает смеситель",
                  )}
                  leftSection={<IconPlus size={16} />}
                  value={customSubcategory}
                  onChange={(event) =>
                    setCustomSubcategory(event.currentTarget.value)
                  }
                />
              )}

              {selectedSubcategory && (
                <Alert color="teal" variant="light" py="xs">
                  {tr(
                    "Ushbu sabab oldin uchragan bo'lsa, tizim uni avtomatik ravishda takroriy deb belgilaydi va Trello kartasida sonini ko'rsatadi.",
                    "Если такая причина уже встречалась, система автоматически отметит обращение как повторное и покажет количество в карточке Trello.",
                  )}
                </Alert>
              )}
            </Stack>
          </Paper>

          <Group grow mt="md" align="flex-end">
            <Button variant="light" color="gray" onClick={onClose}>
              {tr("Bekor qilish", "Отмена")}
            </Button>
            <Button
              style={{ flex: 2 }}
              color={feedbackType === "suggestion" ? "green.7" : "red.7"}
              onClick={handleSubmit}
              disabled={
                !feedbackType ||
                !category ||
                !selectedSubcategory ||
                !isFormValid ||
                totalEvidenceCount === 0 ||
                isLoading
              }
              loading={isLoading}
            >
              {tr(
                "Saqlash va Trello'ga yuborish",
                "Сохранить и отправить в Trello",
              )}
            </Button>
          </Group>
        </Stack>
      </Box>
      <style>{`.blink { animation: blinker 1.5s linear infinite; } @keyframes blinker { 50% { opacity: 0.5; } }`}</style>
    </Modal>
  );
};
