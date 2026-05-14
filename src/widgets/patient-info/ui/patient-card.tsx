import { RequestStatus, type IPatientRequest } from "@/entities/patient"; // 👈 Импортируем правильный тип Заявки
import {
  Paper,
  Avatar,
  Text,
  Group,
  Stack,
  Badge,
  ThemeIcon,
  Button,
  Divider,
} from "@mantine/core";
import {
  IconPhone,
  IconBuildingHospital,
  IconBrandWhatsapp,
  IconPlaneDeparture,
  IconPlaneArrival,
  IconMessageReport, // 👈 Иконка для жалобы
  IconMessageStar,   // 👈 Иконка для положительного отзыва
} from "@tabler/icons-react";
import dayjs from "dayjs";

interface Props {
  patient: IPatientRequest;
}

// Маппинг цветов для статусов
const STATUS_COLORS: Record<string, string> = {
  [RequestStatus.NEW]: "blue",
  [RequestStatus.CONTACTED]: "cyan",
  [RequestStatus.ALL_OK]: "green",
  [RequestStatus.NO_ANSWER]: "yellow",
  [RequestStatus.UNREACHABLE]: "orange",
  [RequestStatus.WRONG_NUMBER]: "gray",
  [RequestStatus.HAS_NOT_WHATSAPP]: "violet",
  [RequestStatus.FEEDBACK_POSITIVE]: "green",
  [RequestStatus.FEEDBACK_NEGATIVE]: "red",
};

const STATUS_LABELS: Record<string, string> = {
  [RequestStatus.NEW]: "Yangi",
  [RequestStatus.CONTACTED]: "Bog'landi",
  [RequestStatus.ALL_OK]: "Hammasi ijobiy",
  [RequestStatus.NO_ANSWER]: "Ko'tarmadi",
  [RequestStatus.UNREACHABLE]: "O'chirilgan",
  [RequestStatus.WRONG_NUMBER]: "Xato raqam",
  [RequestStatus.HAS_NOT_WHATSAPP]: "WhatsApp yo'q",
  [RequestStatus.FEEDBACK_POSITIVE]: "Ijobiy fikr",
  [RequestStatus.FEEDBACK_NEGATIVE]: "Shikoyat",
};

export const PatientCard = ({ patient: request }: Props) => {
  // Вытаскиваем вложенный объект с личными данными человека
  const person = request.patient;

  // Безопасно парсим телефон
  const cleanPhone = person?.phone ? person.phone.replace(/[^0-9+]/g, "") : "";

  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Stack align="center" mb="md">
        <Avatar
          src={null}
          alt={person?.name}
          size={100}
          radius={100}
          color={person?.avatarColor || "blue"}
          style={{ border: `4px solid var(--mantine-color-gray-1)` }}
        >
          {person?.name?.charAt(0) || "?"}
        </Avatar>

        <div style={{ textAlign: "center" }}>
          <Text size="xl" fw={700} style={{ lineHeight: 1.2 }}>
            {person?.name || "Noma'lum"}
          </Text>
          <Badge
            variant="light"
            size="lg"
            color={STATUS_COLORS[request.status] || "gray"}
            mt="xs"
          >
            {STATUS_LABELS[request.status] || request.status}
          </Badge>
        </div>
      </Stack>

      <Divider my="sm" />

      <Stack gap="sm">
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon variant="light" color="gray" size="sm" mt={2}>
            <IconPhone size={14} />
          </ThemeIcon>
          <Text size="sm" fw={500}>
            {person?.phone || "-"}
          </Text>
        </Group>

        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon variant="light" color="gray" size="sm" mt={2}>
            <IconBuildingHospital size={14} />
          </ThemeIcon>
          <Text size="sm" c="dimmed">
            {request.branch || "-"}
          </Text>
        </Group>

        {request.arrivalDate && (
          <Group wrap="nowrap" align="flex-start">
            <ThemeIcon variant="light" color="green" size="sm" mt={2}>
              <IconPlaneArrival size={14} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">
                Kelish sanasi
              </Text>
              <Text size="sm">
                {dayjs(request.arrivalDate).format("DD.MM.YYYY")}
              </Text>
            </div>
          </Group>
        )}

        {request.departureDate && (
          <Group wrap="nowrap" align="flex-start">
            <ThemeIcon variant="light" color="blue" size="sm" mt={2}>
              <IconPlaneDeparture size={14} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">
                Ketish sanasi
              </Text>
              <Text size="sm">
                {dayjs(request.departureDate).format("DD.MM.YYYY")}
              </Text>
            </div>
          </Group>
        )}

        {request.feedback && (
          <>
            <Divider my="xs" variant="dashed" />
            <Group wrap="nowrap" align="flex-start">
              <ThemeIcon
                variant="light"
                color={
                  request.status === RequestStatus.FEEDBACK_NEGATIVE
                    ? "red"
                    : "green"
                }
                size="sm"
                mt={2}
              >
                {request.status === RequestStatus.FEEDBACK_NEGATIVE ? (
                  <IconMessageReport size={14} />
                ) : (
                  <IconMessageStar size={14} />
                )}
              </ThemeIcon>
              <div style={{ flex: 1 }}>
                <Text size="xs" c="dimmed">
                  {request.status === RequestStatus.FEEDBACK_NEGATIVE
                    ? "Shikoyat matni"
                    : "Fikr / Taklif matni"}
                </Text>
                <Text size="sm" style={{ wordBreak: "break-word" }}>
                  {request.feedback.comment || "Izoh qoldirilmagan"}
                </Text>
              </div>
            </Group>
          </>
        )}
      </Stack>

      <Stack gap="xs" mt="lg">
        <Button
          component="a"
          href={`tel:${cleanPhone}`}
          fullWidth
          variant="filled"
          color="blue"
          leftSection={<IconPhone size={18} />}
          disabled={!cleanPhone}
        >
          Qo'ng'iroq qilish
        </Button>

        <Button
          component="a"
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          variant="light"
          color="green"
          leftSection={<IconBrandWhatsapp size={18} />}
          disabled={!cleanPhone}
        >
          WhatsApp
        </Button>
      </Stack>
    </Paper>
  );
};