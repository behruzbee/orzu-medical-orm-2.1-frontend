import { useBroadcastStore } from "@/entities/broadcast";
import { Paper, Text, Box, Group, Avatar, Stack } from "@mantine/core";
import {
  IconChecks,
  IconArrowLeft,
  IconDotsVertical,
} from "@tabler/icons-react";

export const MobilePreview = () => {
  const { messageText } = useBroadcastStore();

  // Заменяем переменные на примеры для превью
  const previewText = messageText
    .replace(/{Patient Name}/g, "Alisher")
    .replace(/{Hospital Name}/g, "Orzu Medical")
    .replace(/{Doctor Name}/g, "Dr. Karimov");

  return (
    <Stack align="center" w="100%">
      <Text fw={700}>Preview (Ko'rinish)</Text>

      <Box
        style={{
          width: 300,
          height: 580,
          backgroundColor: "#111",
          borderRadius: 36,
          padding: 12,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          position: "relative",
          border: "4px solid #333",
        }}
      >
        <Box
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#e5ddd5", // Цвет фона WhatsApp
            backgroundImage:
              "url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)",
            borderRadius: 24,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Group bg="#075e54" p="xs" gap="xs">
            <IconArrowLeft color="white" size={20} />
            <Avatar size="sm" src={null} color="blue" radius="xl">
              OM
            </Avatar>
            <Stack gap={0} style={{ flex: 1 }}>
              <Text size="xs" fw={700} c="white">
                Orzu Medical
              </Text>
              <Text
                size="xs"
                c="dimmed"
                style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}
              >
                Official Account
              </Text>
            </Stack>
            <IconDotsVertical color="white" size={20} />
          </Group>

          <Box p="md" style={{ flex: 1 }}>
            <Group justify="center" mb="md">
              <Paper bg="#dcf8c6" px="xs" py={2} radius="md">
                <Text size="xs" c="dimmed" style={{ fontSize: 10 }}>
                  Bugun
                </Text>
              </Paper>
            </Group>

            {/* Сообщение */}
            <Paper
              p="sm"
              radius="md"
              bg="white"
              shadow="sm"
              style={{
                borderTopLeftRadius: 0,
                maxWidth: "90%",
              }}
            >
              {previewText ? (
                <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                  {previewText}
                </Text>
              ) : (
                <Text size="sm" c="dimmed" fs="italic">
                  Xabar matnini kiriting...
                </Text>
              )}

              <Group justify="flex-end" gap={4} mt={4}>
                <Text size="xs" c="dimmed" style={{ fontSize: 10 }}>
                  10:30
                </Text>
                <IconChecks size={14} color="#34b7f1" />
              </Group>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};
