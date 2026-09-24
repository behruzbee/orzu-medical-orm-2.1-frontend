import {
  RequestStatus,
  type IEvidenceMessage,
  type IPatientRequest,
} from "@/entities/patient";
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
  Accordion,
  ScrollArea,
  Image,
} from "@mantine/core";
import {
  IconPhone,
  IconBuildingHospital,
  IconBrandWhatsapp,
  IconPlaneDeparture,
  IconPlaneArrival,
  IconMessageReport,
  IconMessageStar,
  IconHistory,
  IconPhoto,
  IconMicrophone,
  IconVideo,
  IconFile,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useTranslation, type TranslationKey } from "@/shared/i18n";

export enum EvidenceType {
  TEXT = "text",
  AUDIO = "audio",
  VIDEO = "video",
  IMAGE = "image",
  DOCUMENT = "document",
}

interface Props {
  patient: IPatientRequest;
}

const STATUS_COLORS: Record<string, string> = {
  [RequestStatus.NEW]: "blue",
  [RequestStatus.CONTACTED]: "cyan",
  [RequestStatus.ALL_OK]: "green",
  [RequestStatus.NO_ANSWER]: "yellow",
  [RequestStatus.UNREACHABLE]: "orange",
  [RequestStatus.WRONG_NUMBER]: "gray",
  [RequestStatus.HAS_NOT_WHATSAPP]: "violet",
  [RequestStatus.EMPLOYEE]: "indigo", // 🔥 ДОБАВЛЕНО
  [RequestStatus.FEEDBACK_POSITIVE]: "green",
  [RequestStatus.FEEDBACK_NEGATIVE]: "red",
  [RequestStatus.FEEDBACK_NOT_RELATED]: "dark",
};

const STATUS_KEYS: Record<string, TranslationKey> = {
  [RequestStatus.NEW]: "status.new",
  [RequestStatus.CONTACTED]: "status.contacted",
  [RequestStatus.ALL_OK]: "status.all_ok",
  [RequestStatus.NO_ANSWER]: "status.no_answer",
  [RequestStatus.UNREACHABLE]: "status.unreachable",
  [RequestStatus.WRONG_NUMBER]: "status.wrong_number",
  [RequestStatus.HAS_NOT_WHATSAPP]: "status.has_not_whatsapp",
  [RequestStatus.EMPLOYEE]: "status.employee",
  [RequestStatus.FEEDBACK_POSITIVE]: "status.feedback_pos",
  [RequestStatus.FEEDBACK_NEGATIVE]: "status.feedback_neg",
  [RequestStatus.FEEDBACK_NOT_RELATED]: "status.feedback_not_related",
};

const EvidenceContent = ({ msg }: { msg: IEvidenceMessage }) => {
  const { t } = useTranslation();
  switch (msg.type) {
    case EvidenceType.TEXT:
      return <Text size="sm">{msg.text}</Text>;
    case EvidenceType.IMAGE:
      return (
        <Stack gap="xs">
          {msg.mediaUrl ? (
            <Image
              src={msg.mediaUrl}
              radius="md"
              alt="evidence"
              fit="contain"
              mah={200}
            />
          ) : (
            <Group gap="xs" c="dimmed">
              <IconPhoto size={20} />{" "}
              <Text size="sm">{t("profile.imageMissing")}</Text>
            </Group>
          )}
          {msg.text && <Text size="sm">{msg.text}</Text>}
        </Stack>
      );
    case EvidenceType.AUDIO:
      return (
        <Stack gap="xs">
          {msg.mediaUrl ? (
            <audio
              controls
              src={msg.mediaUrl}
              style={{ width: "100%", height: "36px" }}
            />
          ) : (
            <Group gap="xs" c="dimmed">
              <IconMicrophone size={20} />{" "}
              <Text size="sm">{t("profile.audio")}</Text>
            </Group>
          )}
          {msg.text && (
            <Text size="sm" c="dimmed" fs="italic">
              {msg.text}
            </Text>
          )}
        </Stack>
      );
    case EvidenceType.VIDEO:
      return (
        <Group gap="xs" c="blue">
          <IconVideo size={20} />
          <Text
            size="sm"
            component="a"
            href={msg.mediaUrl}
            target="_blank"
            style={{ textDecoration: "underline" }}
          >
            {t("profile.watchVideo")}
          </Text>
        </Group>
      );
    case EvidenceType.DOCUMENT:
    default:
      return (
        <Group gap="xs" c="blue">
          <IconFile size={20} />
          <Text
            size="sm"
            component="a"
            href={msg.mediaUrl}
            target="_blank"
            style={{ textDecoration: "underline" }}
          >
            {t("profile.downloadDocument")}
          </Text>
        </Group>
      );
  }
};

export const PatientCard = ({ patient: request }: Props) => {
  const { t } = useTranslation();
  const person = request.patient;
  const cleanPhone = person?.phone ? person.phone.replace(/[^0-9+]/g, "") : "";
  const evidenceMessages = request.feedback?.evidenceMessages || [];

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
            {person?.name || t("table.unknown")}
          </Text>
          <Badge
            variant="light"
            size="lg"
            color={STATUS_COLORS[request.status] || "gray"}
            mt="xs"
          >
            {STATUS_KEYS[request.status]
              ? t(STATUS_KEYS[request.status])
              : request.status}
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
                {t("profile.arrival")}
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
                {t("profile.departure")}
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
                    ? t("profile.complaintSummary")
                    : t("profile.suggestionSummary")}
                </Text>
                <Text size="sm" style={{ wordBreak: "break-word" }}>
                  {request.feedback.comment || t("profile.noComment")}
                </Text>
              </div>
            </Group>

            {evidenceMessages.length > 0 && (
              <Accordion variant="separated" radius="md" mt="xs">
                <Accordion.Item value="evidence">
                  <Accordion.Control
                    icon={
                      <IconHistory
                        size={18}
                        color="var(--mantine-color-blue-6)"
                      />
                    }
                  >
                    <Text size="sm" fw={500}>
                      {t("profile.evidenceHistory", {
                        count: evidenceMessages.length,
                      })}
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <ScrollArea h={300} offsetScrollbars type="auto">
                      <Stack gap="md" pr="sm">
                        {evidenceMessages.map((msg, index) => {
                          const isOperator = msg.sender === "operator";
                          const timestamp = msg.originalTimestamp;

                          return (
                            <Paper
                              key={msg.id || index}
                              p="xs"
                              radius="md"
                              bg={isOperator ? "blue.0" : "gray.1"}
                              style={{
                                alignSelf: isOperator
                                  ? "flex-end"
                                  : "flex-start",
                                maxWidth: "90%",
                                borderBottomRightRadius: isOperator
                                  ? 4
                                  : undefined,
                                borderBottomLeftRadius: !isOperator
                                  ? 4
                                  : undefined,
                              }}
                            >
                              <Group justify="space-between" mb={4} gap="xl">
                                <Text
                                  size="xs"
                                  fw={600}
                                  c={isOperator ? "blue.7" : "gray.7"}
                                >
                                  {isOperator
                                    ? t("common.operator")
                                    : t("common.patient")}
                                </Text>
                                {timestamp && (
                                  <Text size="xs" c="dimmed">
                                    {dayjs(timestamp).format("DD.MM HH:mm")}
                                  </Text>
                                )}
                              </Group>

                              <EvidenceContent msg={msg} />
                            </Paper>
                          );
                        })}
                      </Stack>
                    </ScrollArea>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            )}
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
          {t("profile.call")}
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
