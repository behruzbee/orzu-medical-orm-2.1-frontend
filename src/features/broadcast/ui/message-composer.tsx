import { useBroadcastStore } from "@/entities/broadcast";
import {
  Paper,
  Stack,
  Text,
  Textarea,
  Group,
  Button,
  Box,
} from "@mantine/core";
import { IconVariable } from "@tabler/icons-react";
import { useTranslation } from "@/shared/i18n";

const VARIABLES = [
  { label: "Bemor Ismi", value: "{Patient Name}" },
  { label: "Klinika Nomi", value: "{Hospital Name}" },
];

export const MessageComposer = () => {
  const { tr } = useTranslation();
  const { messageText, setMessageText, insertVariable } = useBroadcastStore();

  return (
    <Paper withBorder p="md" radius="md" h="100%" bg="white">
      <Stack gap="md" h="100%">
        <Text fw={700} size="lg">
          {tr("Xabar muharriri", "Редактор сообщения")}
        </Text>

        <Stack gap={4}>
          <Textarea
            label={tr("Xabar matni", "Текст сообщения")}
            placeholder={tr(
              "Xabar matnini kiriting. Masalan: Assalomu alaykum, {Patient Name}...",
              "Введите сообщение. Например: Здравствуйте, {Patient Name}...",
            )}
            autosize
            minRows={6}
            maxRows={12}
            value={messageText}
            onChange={(e) => setMessageText(e.currentTarget.value)}
            maxLength={1000}
            rightSection={
              <Text
                size="xs"
                c="dimmed"
                style={{ alignSelf: "flex-end", paddingBottom: 4 }}
              >
                {messageText.length}/1000
              </Text>
            }
            styles={{
              input: {
                fontFamily: "monospace",
                fontSize: "14px",
              },
            }}
          />
        </Stack>

        <Box>
          <Text size="sm" fw={500} mb="xs">
            {tr("O'zgaruvchini qo'shish", "Вставить переменную")}
          </Text>
          <Group gap="xs" wrap="wrap">
            {VARIABLES.map((v) => (
              <Button
                key={v.value}
                variant="light"
                size="xs"
                color="gray"
                radius="xl"
                leftSection={<IconVariable size={12} />}
                onClick={() => insertVariable(v.value)}
                styles={{
                  root: { backgroundColor: "#f1f3f5", color: "#495057" },
                }}
              >
                {v.value}
              </Button>
            ))}
          </Group>
        </Box>
      </Stack>
    </Paper>
  );
};
