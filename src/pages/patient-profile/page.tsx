import { useState } from "react";
import {
  Grid,
  Stack,
  Button,
  Group,
  LoadingOverlay,
  Text,
  Center,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft, IconAlertCircle, IconMessageReport, IconTrash } from "@tabler/icons-react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { PatientCard } from "@/widgets/patient-info";
import { CallResultForm } from "@/widgets/call-form";
import { ComplaintModal } from "@/widgets/complaint-form-modal";
import { PatientDoctorMessageForm } from "@/features/doctor-message";
import { RequestStatus } from "@/entities/patient";

import {
  useRequest,
  usePatientProfile,
  useDeleteRequestMutation,
  useDeletePatientMutation,
  useAddFeedbackMutation,
} from "@/entities/patient/api";
import { PatientFinishAlert } from "@/widgets/patient-fnish-alert";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "@/shared/i18n";

export const PatientProfilePage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Состояние для двухэтапного модального окна
  const [opened, { open, close }] = useDisclosure(false);
  const [feedbackOpened, { open: openFeedback, close: closeFeedback }] = useDisclosure(false);
  const [confirmStep, setConfirmStep] = useState<1 | 2>(1);

  // Данные текущей заявки
  const {
    data: request,
    isLoading: isRequestLoading,
    isError,
  } = useRequest(id || "");

  // Данные профиля пациента (для проверки истории заявок)
  const { data: profile, isLoading: isProfileLoading } = usePatientProfile(
    request?.patientId || "",
  );

  const deleteRequestMutation = useDeleteRequestMutation();
  const deletePatientMutation = useDeletePatientMutation();
  const addFeedbackMutation = useAddFeedbackMutation();

  if (isRequestLoading || isProfileLoading)
    return <LoadingOverlay visible zIndex={1000} overlayProps={{ blur: 2 }} />;

  if (isError || !request) {
    return (
      <Center h="100%">
        <Stack align="center">
          <IconAlertCircle size={40} color="red" />
          <Text size="lg" fw={500}>
            {t("profile.notFound")}
          </Text>
          <Button component={Link} to="/" variant="light">
            {t("common.back")}
          </Button>
        </Stack>
      </Center>
    );
  }

  const person = request.patient || {};

  // ==========================================
  // 🛡️ СТРОГАЯ ПРОВЕРКА УСЛОВИЙ УДАЛЕНИЯ
  // ==========================================
  const handleDeleteVerification = () => {
    if (!profile?.requests || !request) return;

    // Сортируем заявки от новых к старым
    const sortedRequests = [...profile.requests].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const isFirstTimePatient = sortedRequests.length <= 1;
    const isLatestRequest = sortedRequests[0]?.id === request.id;
    const isStatusNew = request.status.toLowerCase() === "new";

    if (!isStatusNew) {
      notifications.show({
        title: t("profile.forbidden"),
        message: t("profile.newOnly"),
        color: "red",
      });
      return;
    }

    // Если у пациента БЫЛИ заявки ранее
    if (!isFirstTimePatient) {
      if (!isLatestRequest) {
        notifications.show({
          title: t("profile.forbidden"),
          message: t("profile.latestOnly"),
          color: "red",
        });
        return;
      }
    }

    // Если проверки пройдены — сбрасываем шаг на 1 и открываем модалку
    setConfirmStep(1);
    open();
  };

  // Финальное удаление после 2-го подтверждения
  const handleFinalDelete = async () => {
    const isFirstTimePatient = (profile?.requests?.length || 0) <= 1;

    if (isFirstTimePatient) {
      // Первая заявка -> Удаляем всего пациента полностью
      await deletePatientMutation.mutateAsync(request.patientId);
    } else {
      // Есть старая история -> Удаляем только эту (последнюю NEW) заявку
      await deleteRequestMutation.mutateAsync(request.id);
    }

    close();
    navigate("/"); // Перенаправляем на список
  };

  const isFirstTimePatient = (profile?.requests?.length || 0) <= 1;
  const canAddFeedback = [RequestStatus.NEW, RequestStatus.CONTACTED].includes(request.status);

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Button
          component={Link}
          to="/"
          variant="subtle"
          leftSection={<IconArrowLeft size={18} />}
          color="gray"
        >
          {t("profile.back")}
        </Button>

        {/* Кнопка удаления с вызовом проверки */}
        <Button
          variant="light"
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={handleDeleteVerification}
          loading={
            deleteRequestMutation.isPending || deletePatientMutation.isPending
          }
        >
          {isFirstTimePatient
            ? t("profile.deletePatient")
            : t("profile.deleteRequest")}
        </Button>
      </Group>

      <PatientFinishAlert patientId={request.id} status={request.status} />

      <Grid gutter="md" style={{ flex: 1, minHeight: 0 }}>
        <Grid.Col span={{ base: 12, md: 8, lg: 6 }}>
          <Stack gap="md" pb="xl">
            <PatientCard patient={request} />
            <CallResultForm patient={request} />
            <Button
              variant="light"
              leftSection={<IconMessageReport size={18} />}
              onClick={openFeedback}
              disabled={!canAddFeedback}
            >
              {t("chat.feedback")}
            </Button>
            <PatientDoctorMessageForm
              requestId={request.id}
              patientName={person.name || t("table.unknown")}
            />
          </Stack>
        </Grid.Col>

      </Grid>

      <ComplaintModal
        opened={feedbackOpened}
        onClose={closeFeedback}
        selectedMessages={[]}
        isLoading={addFeedbackMutation.isPending}
        onSubmit={(data) => {
          addFeedbackMutation.mutate(
            {
              id: request.id,
              payload: {
                type: data.type,
                category: data.category,
                subcategory: data.subcategory,
                ratings: data.ratings,
                comment: data.evidenceMessages.find((message) => message.type === "text")?.text || data.subcategory,
                sendToTrello: data.sendToTrello,
                evidence: data.evidenceMessages.map((message) => ({
                  type: message.type,
                  text: message.text || "",
                  mediaUrl: message.mediaUrl,
                  duration: message.duration,
                  source: "manual" as const,
                  sender: message.sender,
                  originalTimestamp: data.createdAt,
                })),
              },
            },
            { onSuccess: closeFeedback },
          );
        }}
      />

      <Modal
        opened={opened}
        onClose={close}
        title={
          confirmStep === 1
            ? t("profile.firstConfirm")
            : t("profile.finalConfirm")
        }
        centered
      >
        {confirmStep === 1 ? (
          <Stack gap="md">
            <Text size="sm">
              {isFirstTimePatient
                ? t("profile.deletePatientWarning")
                : t("profile.deleteRequestWarning")}
            </Text>
            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={close}>
                {t("common.cancel")}
              </Button>
              <Button color="orange" onClick={() => setConfirmStep(2)}>
                {t("profile.next")}
              </Button>
            </Group>
          </Stack>
        ) : (
          <Stack gap="md">
            <Text size="sm" fw={700} color="red">
              {t("profile.irreversible")}
            </Text>
            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={close}>
                {t("common.back")}
              </Button>
              <Button
                color="red"
                onClick={handleFinalDelete}
                loading={
                  deleteRequestMutation.isPending ||
                  deletePatientMutation.isPending
                }
              >
                {t("profile.deleteForever")}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};
