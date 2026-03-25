import { useBroadcastStore } from "@/entities/broadcast";
import {
  Paper,
  Stack,
  Select,
  Text,
  Button,
  Group,
  Divider,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconUsers } from "@tabler/icons-react";

export const AudienceFilters = () => {
  const { audienceCount } = useBroadcastStore();

  return (
    <Paper withBorder p="md" radius="md" h="100%">
      <Group justify="space-between" mb="md">
        <Text fw={700}>Filtrlar va Auditoriya</Text>
      </Group>

      <Stack gap="md">
        <Select
          label="Filialni tanlang"
          placeholder="Barcha filiallar"
          data={["Barcha filiallar", "Downtown Clinic", "North Branch"]}
          defaultValue="Barcha filiallar"
        />

        <DatePickerInput
          type="range"
          label="Sana oralig'i"
          placeholder="Sanani tanlang"
        />

        <Divider />

        <Paper
          bg="blue.0"
          p="md"
          radius="md"
          withBorder
          style={{ borderColor: "var(--mantine-color-blue-2)" }}
        >
          <Group justify="space-between" align="center">
            <Text size="sm" fw={600} c="blue.8">
              Tanlangan bemorlar
            </Text>
            <Text size="xl" fw={800} c="blue.6">
              {audienceCount}
            </Text>
          </Group>
          <Button
            fullWidth
            mt="sm"
            variant="white"
            leftSection={<IconUsers size={16} />}
          >
            Ro'yxatni ko'rish
          </Button>
        </Paper>
      </Stack>
    </Paper>
  );
};
