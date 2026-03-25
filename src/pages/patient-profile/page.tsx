import {
  Grid,
  Stack,
  Button,
  Group,
  LoadingOverlay,
  Text,
  Center,
} from "@mantine/core";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";

// Widgets
import { PatientCard } from "@/widgets/patient-info";
import { CallResultForm } from "@/widgets/call-form";
import { WhatsAppChat } from "@/widgets/whatsapp-chat";

// Entity
import { usePatient } from "@/entities/patient/api";
import { PatientFinishAlert } from "@/widgets/patient-fnish-alert";

export const PatientProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: patient, isLoading, isError } = usePatient(id || "");

  if (isLoading)
    return <LoadingOverlay visible zIndex={1000} overlayProps={{ blur: 2 }} />;

  if (isError || !patient) {
    return (
      <Center h="100%">
        <Stack align="center">
          <IconAlertCircle size={40} color="red" />
          <Text size="lg" fw={500}>
            Bemor topilmadi
          </Text>
          <Button component={Link} to="/" variant="light">
            Orqaga
          </Button>
        </Stack>
      </Center>
    );
  }

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
          Ro'yxatga qaytish
        </Button>
      </Group>

      <PatientFinishAlert patientId={patient.id} status={patient.status} />

      <Grid gutter="md" style={{ flex: 1, minHeight: 0 }}>
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }} h="100%">
          <Stack gap="md" pb="xl">
            <PatientCard patient={patient} />
            <CallResultForm patient={patient} />
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8, lg: 9 }} h="100%">
          <WhatsAppChat
            patientId={patient.id}
            patientName={patient.name}
            patientPhone={patient.phone}
            patientStatus={patient.status}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
