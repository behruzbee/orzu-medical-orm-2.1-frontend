import { useState, useRef, useEffect } from "react";
import {
  Paper,
  Stack,
  Group,
  Text,
  Avatar,
  TextInput,
  ActionIcon,
  Box,
  Button,
  Transition,
  Checkbox,
  Slider,
  Popover,
  Loader,
  Center,
  Image,
  LoadingOverlay,
  Badge,
} from "@mantine/core";
import {
  IconSend,
  IconMoodSmile,
  IconChecks,
  IconAlertTriangle,
  IconX,
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconFilePlus,
  IconFileText,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import EmojiPicker from "emoji-picker-react";

import { RequestStatus } from "@/entities/patient";
import { ComplaintModal } from "@/widgets/complaint-form-modal";

// 👇 Импорт API Хуков
import {
  useWhatsappHistory,
  useWhatsappSendMessage,
} from "@/features/whatsapp/api/queries";
import { useAddFeedbackMutation } from "@/entities/patient/api";

interface Props {
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientStatus: string; // 👈 Принимаем статус для блокировки
}

// --- КОМПОНЕНТ АУДИО ПЛЕЕРА ---
const AudioBubble = ({ duration, isMe, isPlaying, onPlay }: any) => (
  <Group gap="xs" wrap="nowrap" align="center" style={{ minWidth: 200 }}>
    <ActionIcon
      variant="filled"
      color={isMe ? "green.9" : "gray.7"}
      radius="xl"
      size="lg"
      onClick={(e) => {
        e.stopPropagation();
        onPlay();
      }}
    >
      {isPlaying ? (
        <IconPlayerPauseFilled size={18} />
      ) : (
        <IconPlayerPlayFilled size={18} />
      )}
    </ActionIcon>
    <Stack gap={0} style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
      <Slider
        size="xs"
        color={isMe ? "green.8" : "gray.5"}
        label={null}
        defaultValue={0}
        thumbSize={12}
      />
      <Text size="xs" c="dimmed" mt={4}>
        {isPlaying ? "Eshittirilmoqda..." : duration}
      </Text>
    </Stack>
  </Group>
);

export const WhatsAppChat = ({
  patientId,
  patientName,
  patientPhone,
  patientStatus,
}: Props) => {
  const { data: messages = [], isLoading } = useWhatsappHistory(patientPhone);
  const { mutate: sendMessage, isPending: isSending } =
    useWhatsappSendMessage();
  const { mutate: sendFeedback, isPending: isSavingFeedback } =
    useAddFeedbackMutation();
  const [input, setInput] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const viewport = useRef<HTMLDivElement>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [emojiOpened, setEmojiOpened] = useState(false);

  const isLocked = ![RequestStatus.NEW, RequestStatus.CONTACTED].includes(
    patientStatus as RequestStatus,
  );

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendText = () => {
    if (!input.trim() || isLocked) return;
    sendMessage({ phone: patientPhone, text: input });
    setInput("");
    setEmojiOpened(false);
  };

  const handlePlayAudio = (url: string | undefined, id: string) => {
    if (!url) return;
    if (playingAudioId === id) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();

    const newAudio = new Audio(url);
    newAudio.onended = () => setPlayingAudioId(null);
    audioRef.current = newAudio;
    newAudio.play().catch((e) => console.error("Audio play error", e));
    setPlayingAudioId(id);
  };

  const toggleSelection = (id: string) => {
    // В режиме блокировки можно выбирать сообщения (чтобы почитать или посмотреть),
    // но нельзя прикрепить их к новой жалобе (так как создание жалоб закрыто).
    // Если вы хотите запретить даже выделение, добавьте: if (isLocked) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // --- ОТПРАВКА ЖАЛОБЫ ---
  const handleComplaintSubmit = (data: any) => {
    const payload = {
      ratings: data.ratings,
      comment: "Shikoyat / Taklif / OK (CRM Interface)",
      sendToTrello: data.sendToTrello,
      evidence: data.evidenceMessages.map((msg: any) => ({
        type: msg.type,
        text: msg.text || "",
        mediaUrl: msg.mediaUrl,
        duration: msg.duration,
        source: msg.source || "manual",
        sender: msg.sender || "operator",
        originalTimestamp: msg.timestamp || new Date().toISOString(),
      })),
    };

    sendFeedback(
      { id: patientId, payload },
      {
        onSuccess: () => {
          closeModal();
          setSelectedIds([]);
        },
      },
    );
  };

  return (
    <>
      <Paper
        withBorder
        radius="md"
        h="100%"
        display="flex"
        style={{
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Оверлей загрузки при сохранении жалобы */}
        <LoadingOverlay
          visible={isSavingFeedback}
          zIndex={1000}
          overlayProps={{ blur: 2 }}
          loaderProps={{
            children: (
              <Text fw={700} c="white">
                Saqlanmoqda...
              </Text>
            ),
          }}
        />

        {/* --- HEADER --- */}
        <Group bg="#f0f2f5" p="xs" px="md" justify="space-between">
          <Group>
            <Avatar src={null} alt={patientName} radius="xl" color="green" />
            <Box>
              <Text size="sm" fw={600}>
                {patientName}
              </Text>
              <Text size="xs" c="green.7" fw={500}>
                WhatsApp
              </Text>
            </Box>
          </Group>

          <Group gap="xs">
            {/* Если заблокировано - показываем статус Архив */}
            {isLocked ? (
              <Badge color="gray" variant="light" size="lg">
                Arxiv (Read-only)
              </Badge>
            ) : // Если активно
            selectedIds.length > 0 ? (
              <>
                <Text size="xs" fw={700} c="brand">
                  Tanlandi: {selectedIds.length}
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => setSelectedIds([])}
                >
                  <IconX size={16} />
                </ActionIcon>
              </>
            ) : (
              <Button
                size="xs"
                variant="light"
                color="red"
                leftSection={<IconFilePlus size={16} />}
                onClick={openModal}
              >
                Shikoyat / Taklif
              </Button>
            )}
          </Group>
        </Group>

        {/* --- CHAT BODY --- */}
        <Box
          ref={viewport}
          style={{
            flex: 1,
            backgroundColor: "#efeae2",
            backgroundImage:
              "url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)",
            overflowY: "auto",
            maxHeight: "600px",
            position: "relative",
          }}
        >
          {isLoading ? (
            <Center h="100%">
              <Loader color="gray" type="dots" />
            </Center>
          ) : messages.length === 0 ? (
            <Center h="100%">
              <Text
                size="sm"
                c="dimmed"
                bg="white"
                px="md"
                py="xs"
                style={{ borderRadius: 10, opacity: 0.8 }}
              >
                Yozishmalar tarixi bo'sh
              </Text>
            </Center>
          ) : (
            <Stack p="md" gap="xs" pb={20}>
              {messages.map((msg) => {
                const isMe = msg.sender === "operator";
                const isSelected = selectedIds.includes(msg.id);

                return (
                  <Group
                    key={msg.id}
                    justify={isMe ? "flex-end" : "flex-start"}
                    align="flex-start"
                    gap="sm"
                    onClick={() => !isLocked && toggleSelection(msg.id)} // Блокируем выбор, если locked (опционально)
                    style={{ cursor: isLocked ? "default" : "pointer" }}
                  >
                    {isSelected && (
                      <Checkbox
                        checked
                        readOnly
                        size="xs"
                        color="brand"
                        tabIndex={-1}
                        style={{ marginTop: 10 }}
                      />
                    )}

                    <Paper
                      p="xs"
                      radius="md"
                      bg={isSelected ? "#fff9db" : isMe ? "#d9fdd3" : "white"}
                      shadow="xs"
                      style={{
                        maxWidth: msg.type === "image" ? "60%" : "75%",
                        minWidth: msg.type === "image" ? "40%" : "auto",
                        position: "relative",
                        border: isSelected ? "1px solid #fab005" : "none",
                      }}
                    >
                      {/* Текст */}
                      {msg.type === "text" && (
                        <Text
                          size="sm"
                          c="dark"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {msg.text}
                        </Text>
                      )}

                      {/* Аудио */}
                      {msg.type === "audio" && (
                        <AudioBubble
                          duration={msg.duration}
                          isMe={isMe}
                          isPlaying={playingAudioId === msg.id}
                          onPlay={() => handlePlayAudio(msg.mediaUrl, msg.id)}
                        />
                      )}

                      {/* Фото */}
                      {msg.type === "image" && (
                        <Stack gap={4}>
                          <Image
                            src={msg.mediaUrl}
                            radius="sm"
                            fit="cover"
                            style={{ maxHeight: 300, width: "100%" }}
                            fallbackSrc="https://placehold.co/400x300?text=Yuklanmadi"
                          />
                          {msg.text && <Text size="sm">{msg.text}</Text>}
                        </Stack>
                      )}

                      {/* Видео */}
                      {msg.type === "video" && (
                        <Stack gap={4}>
                          <Box
                            style={{
                              borderRadius: 6,
                              overflow: "hidden",
                              background: "#000",
                            }}
                          >
                            <video
                              src={msg.mediaUrl}
                              controls
                              style={{ width: "100%", display: "block" }}
                            />
                          </Box>
                          {msg.text && <Text size="sm">{msg.text}</Text>}
                        </Stack>
                      )}

                      {/* Документы */}
                      {!["text", "audio", "image", "video"].includes(
                        msg.type,
                      ) && (
                        <Group gap="xs" bg="gray.1" p="xs">
                          <IconFileText size={20} />
                          <Text size="xs" lineClamp={1}>
                            {msg.text || "Fayl"}
                          </Text>
                        </Group>
                      )}

                      <Group
                        gap={4}
                        justify="flex-end"
                        mt={4}
                        style={{ opacity: 0.7 }}
                      >
                        <Text size="xs" c="dimmed" style={{ fontSize: 10 }}>
                          {msg.timestamp}
                        </Text>
                        {isMe && (
                          <IconChecks
                            size={14}
                            color={msg.status === "read" ? "#53bdeb" : "gray"}
                          />
                        )}
                      </Group>
                    </Paper>
                  </Group>
                );
              })}
            </Stack>
          )}
        </Box>

        {/* --- INPUT AREA --- */}
        {!isLocked ? (
          <Group p="sm" bg="#f0f2f5" gap="xs" align="center">
            <Popover
              position="top-start"
              withArrow
              shadow="md"
              opened={emojiOpened}
              onChange={setEmojiOpened}
            >
              <Popover.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => setEmojiOpened((o) => !o)}
                >
                  <IconMoodSmile />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown p={0}>
                <EmojiPicker
                  onEmojiClick={(d) => setInput((p) => p + d.emoji)}
                  width={300}
                  height={400}
                  previewConfig={{ showPreview: false }}
                />
              </Popover.Dropdown>
            </Popover>

            <TextInput
              placeholder="Xabar yozing..."
              style={{ flex: 1 }}
              radius="xl"
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendText()}
              disabled={isSending}
            />

            <ActionIcon
              variant="filled"
              color="brand"
              radius="xl"
              size="lg"
              onClick={handleSendText}
              loading={isSending}
              disabled={!input.trim()}
            >
              <IconSend size={18} />
            </ActionIcon>
          </Group>
        ) : (
          // Блок если чат закрыт
          <Box p="sm" bg="gray.1" style={{ borderTop: "1px solid #eee" }}>
            <Text size="sm" c="dimmed" ta="center" fs="italic">
              Suhbat yakunlangan. Xabar yozish va shikoyat qoldirish imkonsiz.
            </Text>
          </Box>
        )}

        {/* --- ПЛАВАЮЩАЯ КНОПКА --- */}
        {!isLocked && (
          <Transition
            transition="slide-up"
            mounted={selectedIds.length > 0}
            duration={200}
          >
            {(styles) => (
              <Box
                style={{
                  ...styles,
                  position: "absolute",
                  bottom: 80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 100,
                }}
              >
                <Button
                  color="red.7"
                  radius="xl"
                  size="md"
                  leftSection={<IconAlertTriangle size={20} />}
                  onClick={openModal}
                >
                  Tanlanganni biriktirish ({selectedIds.length})
                </Button>
              </Box>
            )}
          </Transition>
        )}
      </Paper>

      {!isLocked && (
        <ComplaintModal
          opened={modalOpened}
          onClose={closeModal}
          selectedMessages={messages.filter((m) => selectedIds.includes(m.id))}
          onSubmit={handleComplaintSubmit}
          isLoading={isSavingFeedback}
        />
      )}
    </>
  );
};
