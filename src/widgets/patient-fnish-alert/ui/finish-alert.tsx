import { useState, useEffect } from "react";
import { Alert, Group, RingProgress, Box, Text, Button } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PatientStatus } from "@/entities/patient";
import { RevertStatusButton } from "@/features/patient/revert-status/ui/revert-button"; // 👇 Импорт фичи

interface Props {
  patientId: string;
  status: PatientStatus;
}

export const PatientFinishAlert = ({ patientId, status }: Props) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);
  const [isCancelled, setIsCancelled] = useState(false);

  const isFinished = ![PatientStatus.NEW, PatientStatus.CONTACTED].includes(
    status
  );

  useEffect(() => {
    if (isFinished && !isCancelled) {
      if (timer === 0) {
        navigate("/");
        return;
      }
      const interval = setInterval(() => setTimer((p) => p - 1), 1000);
      return () => clearInterval(interval);
    }
    if (!isFinished) {
      setIsCancelled(false);
      setTimer(5);
    }
  }, [isFinished, isCancelled, timer, navigate]);

  if (!isFinished) return null;

  if (isCancelled) {
    return (
      <Alert
        variant="light"
        color="orange"
        title="Arxiv holati"
        icon={<IconInfoCircle />}
        mb="md"
      >
        <Group justify="space-between">
          <Text size="sm">
            Ushbu bemor bilan ish yakunlangan. O'zgartirish kiritish uchun
            statusni qaytaring.
          </Text>
          <RevertStatusButton
            patientId={patientId}
            onSuccess={() => setIsCancelled(false)}
          />
        </Group>
      </Alert>
    );
  }

  return (
    <Alert
      variant="light"
      color="blue"
      title="Ish yakunlangan"
      icon={<IconInfoCircle />}
      radius="md"
      mb="md"
    >
      <Group justify="space-between" align="center">
        <Group>
          <RingProgress
            size={40}
            thickness={4}
            roundCaps
            sections={[{ value: (timer / 5) * 100, color: "blue" }]}
            label={
              <Text c="blue" fw={700} ta="center" size="xs">
                {timer}
              </Text>
            }
          />
          <Box>
            <Text size="sm" fw={500}>
              Bemor statusi arxivga o'tkazilgan.
            </Text>
            <Text size="xs">Avtomatik ravishda bosh sahifaga qaytish...</Text>
          </Box>
        </Group>

        <Group>
          <Button
            variant="white"
            color="blue"
            size="xs"
            onClick={() => setIsCancelled(true)}
          >
            Qolish (Bekor qilish)
          </Button>
        </Group>
      </Group>
    </Alert>
  );
};
