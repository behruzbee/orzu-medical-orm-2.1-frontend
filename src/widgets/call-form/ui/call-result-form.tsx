import { useState, useEffect } from "react";
import {
  Paper,
  Text,
  Radio,
  Button,
  Stack,
  Textarea,
  Divider,
  Alert,
  Group,
} from "@mantine/core";
import { IconDeviceFloppy, IconPhoneCall, IconLock } from "@tabler/icons-react";
import { useAddCallStatusMutation } from "@/entities/patient/api";
import { RequestStatus, type IPatientRequest } from "@/entities/patient";
import { useTranslation } from "@/shared/i18n";

interface Props {
  patient: IPatientRequest;
}

const EDITABLE_STATUSES = [RequestStatus.NEW, RequestStatus.CONTACTED];

export const CallResultForm = ({ patient: request }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<RequestStatus | null>(null);
  const [note, setNote] = useState("");

  const { mutate, isPending } = useAddCallStatusMutation();

  const isLocked = !EDITABLE_STATUSES.includes(request.status);

  useEffect(() => {
    if (isLocked) {
      setStatus(request.status);

      if (request.callStatus?.note) {
        setNote(request.callStatus.note);
      } else if (request.feedback?.comment) {
        setNote(request.feedback.comment);
      } else {
        setNote("");
      }
    } else {
      setStatus(null);
      setNote("");
    }
  }, [request, isLocked]);

  const handleSubmit = () => {
    if (!status || isLocked) return;

    mutate(
      {
        id: request.id,
        payload: {
          status: status,
          note: note,
        },
      },
      {
        onSuccess: () => {
          setNote("");
          setStatus(null);
        },
      },
    );
  };

  return (
    <Paper withBorder p="md" radius="md" bg={isLocked ? "gray.0" : "white"}>
      <Group justify="space-between" mb="md">
        <Text fw={600} tt="uppercase" size="xs" c="dimmed">
          {isLocked ? t("call.finalResult") : t("call.enterResult")}
        </Text>
        {isLocked && <IconLock size={16} color="gray" />}
      </Group>

      {isLocked && (
        <Alert variant="light" color="blue" mb="md" p="xs">
          <Text size="xs">{t("call.locked")}</Text>
        </Alert>
      )}

      <Radio.Group
        value={status || ""}
        onChange={(val) => !isLocked && setStatus(val as RequestStatus)}
        label={isLocked ? t("call.selectedStatus") : t("call.question")}
        withAsterisk={!isLocked}
        mb="md"
      >
        <Stack gap="sm" mt="xs">
          <Radio
            value={RequestStatus.ALL_OK}
            label={t("call.allOk")}
            color="green"
            disabled={isLocked && status !== RequestStatus.ALL_OK}
            style={{
              opacity: isLocked && status !== RequestStatus.ALL_OK ? 0.5 : 1,
            }}
          />

          <Radio
            value={RequestStatus.NO_ANSWER}
            label={t("call.noAnswer")}
            color="yellow"
            disabled={isLocked && status !== RequestStatus.NO_ANSWER}
            style={{
              opacity: isLocked && status !== RequestStatus.NO_ANSWER ? 0.5 : 1,
            }}
          />

          <Radio
            value={RequestStatus.UNREACHABLE}
            label={t("call.unreachable")}
            color="orange"
            disabled={isLocked && status !== RequestStatus.UNREACHABLE}
            style={{
              opacity:
                isLocked && status !== RequestStatus.UNREACHABLE ? 0.5 : 1,
            }}
          />

          <Radio
            value={RequestStatus.WRONG_NUMBER}
            label={t("call.wrongNumber")}
            color="gray"
            disabled={isLocked && status !== RequestStatus.WRONG_NUMBER}
            style={{
              opacity:
                isLocked && status !== RequestStatus.WRONG_NUMBER ? 0.5 : 1,
            }}
          />

          <Radio
            value={RequestStatus.HAS_NOT_WHATSAPP}
            label={t("call.noWhatsapp")}
            color="violet"
            disabled={isLocked && status !== RequestStatus.HAS_NOT_WHATSAPP}
            style={{
              opacity:
                isLocked && status !== RequestStatus.HAS_NOT_WHATSAPP ? 0.5 : 1,
            }}
          />

          <Radio
            value={RequestStatus.EMPLOYEE}
            label={t("call.employee")}
            color="blue"
            disabled={isLocked && status !== RequestStatus.EMPLOYEE}
            style={{
              opacity: isLocked && status !== RequestStatus.EMPLOYEE ? 0.5 : 1,
            }}
          />

          {(status === RequestStatus.FEEDBACK_POSITIVE ||
            status === RequestStatus.FEEDBACK_NEGATIVE) && (
            <Radio
              value={status}
              label={
                status === RequestStatus.FEEDBACK_POSITIVE
                  ? t("call.positive")
                  : t("call.complaint")
              }
              color={
                status === RequestStatus.FEEDBACK_POSITIVE ? "green" : "red"
              }
              checked
              readOnly
            />
          )}
        </Stack>
      </Radio.Group>

      <Divider my="sm" />

      <Textarea
        label={t("call.operatorNote")}
        placeholder={isLocked ? t("call.noNote") : t("call.notePlaceholder")}
        minRows={3}
        mb="md"
        value={note}
        onChange={(event) => setNote(event.currentTarget.value)}
        disabled={isLocked}
      />

      {!isLocked && (
        <Button
          fullWidth
          leftSection={
            status === RequestStatus.CONTACTED ? (
              <IconPhoneCall size={18} />
            ) : (
              <IconDeviceFloppy size={18} />
            )
          }
          color={status === RequestStatus.CONTACTED ? "teal" : "brand"}
          onClick={handleSubmit}
          loading={isPending}
          disabled={!status}
        >
          {status === RequestStatus.CONTACTED
            ? t("call.startSave")
            : t("call.save")}
        </Button>
      )}
    </Paper>
  );
};
