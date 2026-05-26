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

interface Props {
  patient: IPatientRequest; 
}

const EDITABLE_STATUSES = [RequestStatus.NEW, RequestStatus.CONTACTED];

export const CallResultForm = ({ patient: request }: Props) => {
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
        onChange={(val) => !isLocked && setStatus(val as RequestStatus)}
        label={isLocked ? "Tanlangan holat:" : "Natija qanday bo'ldi?"}
        withAsterisk={!isLocked}
        mb="md"
      >
        <Stack gap="sm" mt="xs">
          <Radio
            value={RequestStatus.ALL_OK}
            label="✅ Hammasi ijobiy (OK)"
            color="green"
            disabled={isLocked && status !== RequestStatus.ALL_OK}
            style={{
              opacity: isLocked && status !== RequestStatus.ALL_OK ? 0.5 : 1,
            }}
          />

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

          <Radio
            value={RequestStatus.HAS_NOT_WHATSAPP}
            label="💬 WhatsApp tarmog'ida yo'q"
            color="violet"
            disabled={isLocked && status !== RequestStatus.HAS_NOT_WHATSAPP}
            style={{
              opacity:
                isLocked && status !== RequestStatus.HAS_NOT_WHATSAPP ? 0.5 : 1,
            }}
          />

          <Radio
            value={RequestStatus.EMPLOYEE}
            label="👔 Xodim raqami"
            color="blue"
            disabled={isLocked && status !== RequestStatus.EMPLOYEE}
            style={{
              opacity:
                isLocked && status !== RequestStatus.EMPLOYEE ? 0.5 : 1,
            }}
          />

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