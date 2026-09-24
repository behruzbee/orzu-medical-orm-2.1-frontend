import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import {
  IconBellRinging,
  IconCheck,
  IconExternalLink,
  IconStethoscope,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import {
  doctorMessageKeys,
  doctorMessagesApi,
  type DoctorMessageEvent,
  type DoctorPatientMessage,
  useMarkDoctorMessageDoneMutation,
  usePendingDoctorMessages,
} from "@/entities/doctor-message";
import type { User } from "@/entities/user";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/shared/i18n";

interface Props {
  user: User;
}

const isDoctorCabinet = (user: User) =>
  user.role === "doctor" || user.role === "admin";

export const DoctorMessageAlert = ({ user }: Props) => {
  const { tr } = useTranslation();
  const enabled = isDoctorCabinet(user);
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: pendingMessages = [] } = usePendingDoctorMessages(enabled);
  const markDoneMutation = useMarkDoctorMessageDoneMutation();

  const activeMessage = useMemo<DoctorPatientMessage | undefined>(() => {
    if (activeId) {
      return pendingMessages.find((message) => message.id === activeId);
    }

    return pendingMessages[0];
  }, [activeId, pendingMessages]);

  useEffect(() => {
    if (!enabled || pendingMessages.length === 0) {
      setActiveId(null);
      return;
    }

    if (!activeMessage) {
      setActiveId(pendingMessages[0].id);
    }
  }, [activeMessage, enabled, pendingMessages]);

  useEffect(() => {
    if (!enabled) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    const stream = new EventSource(doctorMessagesApi.getStreamUrl(token));

    stream.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as DoctorMessageEvent;

        queryClient.invalidateQueries({
          queryKey: doctorMessageKeys.pending(),
        });

        if (data.type === "created") {
          setActiveId(data.message.id);
          notifications.show({
            title: tr("Shifokorga yangi xabar", "Новое сообщение врачу"),
            message:
              data.message.request?.patient?.name ||
              tr("Bemor bo'yicha yangi xabar", "Новое сообщение о пациенте"),
            color: "red",
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error("Doctor message stream parse error:", error);
      }
    };

    stream.onerror = () => {
      stream.close();
    };

    return () => {
      stream.close();
    };
  }, [enabled, queryClient, tr]);

  useEffect(() => {
    if (!enabled || !activeMessage) return;

    const originalTitle = document.title;
    document.title = `(${pendingMessages.length}) ${tr("Shifokor xabari", "Сообщение врачу")}`;

    const interval = window.setInterval(() => {
      notifications.show({
        title: tr("Shifokor xabari kutilmoqda", "Ожидает сообщение врачу"),
        message: tr(
          "Xabarni ko'rib, bajarilgandan keyin «Bajarildi» ni bosing.",
          "Просмотрите сообщение и после выполнения нажмите «Выполнено».",
        ),
        color: "red",
        autoClose: 4500,
      });
    }, 15000);

    return () => {
      window.clearInterval(interval);
      document.title = originalTitle;
    };
  }, [activeMessage, enabled, pendingMessages.length, tr]);

  if (!enabled || !activeMessage) {
    return null;
  }

  const patient = activeMessage.request?.patient;
  const createdAt = dayjs(activeMessage.createdAt).format("DD.MM.YYYY HH:mm");

  const handleDone = () => {
    markDoneMutation.mutate(activeMessage.id, {
      onSuccess: () => {
        const nextMessage = pendingMessages.find(
          (message) => message.id !== activeMessage.id,
        );
        setActiveId(nextMessage?.id || null);
      },
    });
  };

  return (
    <Modal
      opened
      onClose={() => undefined}
      centered
      size="lg"
      title={
        <Group gap="xs">
          <ThemeIcon color="red" variant="light" size="md">
            <IconBellRinging size={18} />
          </ThemeIcon>
          <Text fw={700}>
            {tr("Shifokor uchun xabar", "Сообщение для врача")}
          </Text>
          <Badge color="red" variant="light">
            {pendingMessages.length}
          </Badge>
        </Group>
      }
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      overlayProps={{ blur: 3 }}
      zIndex={1200}
    >
      <Stack gap="md">
        <Group align="flex-start" justify="space-between" wrap="nowrap">
          <div>
            <Text size="xs" c="dimmed">
              {tr("Bemor", "Пациент")}
            </Text>
            <Text fw={700} size="lg">
              {patient?.name || tr("Noma'lum bemor", "Неизвестный пациент")}
            </Text>
            <Text size="sm" c="dimmed">
              {patient?.phone || "-"} · {activeMessage.request?.branch || "-"}
            </Text>
          </div>

          <Badge color="orange" variant="filled">
            {createdAt}
          </Badge>
        </Group>

        <Divider />

        <Group gap="xs" c="red">
          <IconStethoscope size={18} />
          <Text size="sm" fw={700}>
            {tr("Tuzatish kerak", "Требуется исправление")}
          </Text>
        </Group>

        <Text
          size="md"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {activeMessage.message}
        </Text>

        <Group justify="space-between" align="center" mt="xs">
          <Button
            component={Link}
            to={`/patients/${activeMessage.requestId}`}
            variant="light"
            leftSection={<IconExternalLink size={16} />}
          >
            {tr("Bemor kartasini ochish", "Открыть карточку пациента")}
          </Button>

          <Button
            color="green"
            leftSection={<IconCheck size={16} />}
            onClick={handleDone}
            loading={markDoneMutation.isPending}
          >
            {tr("Bajarildi", "Выполнено")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
