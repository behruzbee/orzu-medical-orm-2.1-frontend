import { RequestStatus, type IPatient } from "@/entities/patient";
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
} from "@tabler/icons-react";
import dayjs from "dayjs";

interface Props {
  patient: IPatient;
}

// Маппинг цветов для статусов
const STATUS_COLORS: Record<string, string> = {
  [RequestStatus.NEW]: "blue",
  [RequestStatus.CONTACTED]: "cyan",
  [RequestStatus.NO_ANSWER]: "yellow",
  [RequestStatus.UNREACHABLE]: "orange",
  [RequestStatus.WRONG_NUMBER]: "gray",
  [RequestStatus.FEEDBACK_POSITIVE]: "green",
  [RequestStatus.FEEDBACK_NEGATIVE]: "red",
};

const STATUS_LABELS: Record<string, string> = {
  [RequestStatus.NEW]: "Yangi",
  [RequestStatus.CONTACTED]: "Bog'landi",
  [RequestStatus.NO_ANSWER]: "Ko'tarmadi",
  [RequestStatus.UNREACHABLE]: "O'chirilgan",
  [RequestStatus.WRONG_NUMBER]: "Xato raqam",
  [RequestStatus.FEEDBACK_POSITIVE]: "Ijobiy fikr",
  [RequestStatus.FEEDBACK_NEGATIVE]: "Shikoyat",
};

export const PatientCard = ({ patient }: Props) => {
  const cleanPhone = patient.phone.replace(/[^0-9+]/g, "");

  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Stack align="center" mb="md">
        <Avatar
          src={null} // Если будет URL фото, вставьте сюда
          alt={patient.name}
          size={100}
          radius={100}
          color={patient.avatarColor || "blue"}
          style={{ border: `4px solid var(--mantine-color-gray-1)` }}
        >
          {patient.name.charAt(0)}
        </Avatar>

        <div style={{ textAlign: "center" }}>
          <Text size="xl" fw={700} style={{ lineHeight: 1.2 }}>
            {patient.name}
          </Text>
          <Badge
            variant="light"
            size="lg"
            color={STATUS_COLORS[patient.status] || "gray"}
            mt="xs"
          >
            {STATUS_LABELS[patient.status] || patient.status}
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
            {patient.phone}
          </Text>
        </Group>

        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon variant="light" color="gray" size="sm" mt={2}>
            <IconBuildingHospital size={14} />
          </ThemeIcon>
          <Text size="sm" c="dimmed">
            {patient.branch}
          </Text>
        </Group>

        {patient.arrivalDate && (
          <Group wrap="nowrap" align="flex-start">
            <ThemeIcon variant="light" color="green" size="sm" mt={2}>
              <IconPlaneArrival size={14} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">
                Kelish sanasi
              </Text>
              <Text size="sm">
                {dayjs(patient.arrivalDate).format("DD.MM.YYYY")}
              </Text>
            </div>
          </Group>
        )}

        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon variant="light" color="blue" size="sm" mt={2}>
            <IconPlaneDeparture size={14} />
          </ThemeIcon>
          <div>
            <Text size="xs" c="dimmed">
              Ketish sanasi
            </Text>
            <Text size="sm">
              {dayjs(patient.departureDate).format("DD.MM.YYYY")}
            </Text>
          </div>
        </Group>
      </Stack>

      <Stack gap="xs" mt="lg">
        <Button
          component="a"
          href={`tel:${cleanPhone}`}
          fullWidth
          variant="filled"
          color="blue"
          leftSection={<IconPhone size={18} />}
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
        >
          WhatsApp
        </Button>
      </Stack>
    </Paper>
  );
};
