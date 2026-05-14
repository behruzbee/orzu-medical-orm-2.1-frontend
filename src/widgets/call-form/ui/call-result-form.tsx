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
import { RequestStatus, type IPatient } from "@/entities/patient";

interface Props {
  patient: IPatient;
}

const EDITABLE_STATUSES = [RequestStatus.NEW, RequestStatus.CONTACTED];

export const CallResultForm = ({ patient }: Props) => {
  const [status, setStatus] = useState<RequestStatus | null>(null);
  const [note, setNote] = useState("");

  const { mutate, isPending } = useAddCallStatusMutation();

  const isLocked = !EDITABLE_STATUSES.includes(patient.status);

  useEffect(() => {
    if (isLocked) {
      setStatus(patient.status);

      if (patient.callHistory && patient.callHistory.length > 0) {
        const lastHistoryItem = [...patient.callHistory].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        setNote(lastHistoryItem.note || "");
      }
    } else {
      setStatus(null);
      setNote("");
    }
  }, [patient, isLocked]);

  const handleSubmit = () => {
    if (!status || isLocked) return;

    mutate(
      {
        id: patient.id,
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
      }
    );
  };

  return (
    <Paper withBorder p="md" radius="md" bg={isLocked ? "gray.0" : "white"}>
      <Group justify="space-between" mb="md">
        <Text fw={600} tt="uppercase" size="xs" c="dimmed">
          {isLocked ? "Yakuniy natija" : "Qo'ng'iroq natijasini kiritish"}
        </Text>
        {isLocked && <IconLock size={16} color="gray" />}
      </Group>

      {isLocked && (
        <Alert variant="light" color="blue" mb="md" p="xs">
          <Text size="xs">
            Ushbu bemor bilan ishlash yakunlangan. O'zgartirish imkonsiz.
          </Text>
        </Alert>
      )}

      <Radio.Group
        value={status || ""}
        onChange={(val) => !isLocked && setStatus(val as RequestStatus)} // Блокируем изменение
        label={isLocked ? "Tanlangan holat:" : "Natija qanday bo'ldi?"}
        withAsterisk={!isLocked}
        mb="md"
      >
        <Stack gap="sm" mt="xs">
          <Radio
            value={RequestStatus.NO_ANSWER}
            label="📵 Ko'tarmadi (No Answer)"
            color="yellow"
            disabled={isLocked && status !== RequestStatus.NO_ANSWER}
            style={{
              opacity: isLocked && status !== RequestStatus.NO_ANSWER ? 0.5 : 1,
            }}
          />

          <Radio
            value={RequestStatus.UNREACHABLE}
            label="🔌 O'chirilgan / Bog'lanib bo'lmaydi"
            color="orange"
            disabled={isLocked && status !== RequestStatus.UNREACHABLE}
            style={{
              opacity:
                isLocked && status !== RequestStatus.UNREACHABLE ? 0.5 : 1,
            }}
          />

          <Radio
            value={RequestStatus.WRONG_NUMBER}
            label="⚠️ Noto'g'ri raqam"
            color="gray"
            disabled={isLocked && status !== RequestStatus.WRONG_NUMBER}
            style={{
              opacity:
                isLocked && status !== RequestStatus.WRONG_NUMBER ? 0.5 : 1,
            }}
          />

          {/* Если статус "Shikoyat" или "Feedback", можно добавить для отображения */}
          {(status === RequestStatus.FEEDBACK_POSITIVE ||
            status === RequestStatus.FEEDBACK_NEGATIVE) && (
            <Radio
              value={status}
              label={
                status === RequestStatus.FEEDBACK_POSITIVE
                  ? "😊 Ijobiy fikr"
                  : "😡 Shikoyat"
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
        label="Operator izohi"
        placeholder={isLocked ? "Izoh yo'q" : "Izoh qoldirish..."}
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
            ? "Suhbatni boshlash / Saqlash"
            : "Natijani saqlash"}
        </Button>
      )}
    </Paper>
  );
};
