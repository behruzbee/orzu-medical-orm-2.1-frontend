import { Container, Title, Text, Button, Group, Box } from "@mantine/core";
import { IconArrowLeft, IconHome } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <Box
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--mantine-color-gray-0)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Text
        c="gray.2"
        fw={900}
        style={{
          fontSize: "25vw",
          lineHeight: 1,
          position: "absolute",
          zIndex: 0,
          opacity: 0.6,
          userSelect: "none",
        }}
      >
        404
      </Text>

      <Container
        size="md"
        style={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <Title
          order={1}
          style={{
            fontSize: 38,
            fontWeight: 900,
            marginBottom: 16,
            color: "var(--mantine-color-dark-8)",
          }}
        >
          Kechirasiz, bunday sahifa topilmadi
        </Title>

        <Text c="dimmed" size="lg" maw={500} mx="auto" mb={30}>
          Siz qidirayotgan sahifa o'chirilgan, nomi o'zgartirilgan yoki
          vaqtincha mavjud emas. Iltimos, manzilni tekshiring yoki bosh sahifaga
          qayting.
        </Text>

        <Group justify="center" gap="md">
          <Button
            variant="default"
            size="md"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => window.history.back()}
          >
            Ortga qaytish
          </Button>

          <Button
            component={Link}
            to="/"
            variant="filled"
            size="md"
            leftSection={<IconHome size={18} />}
          >
            Bosh sahifaga
          </Button>
        </Group>
      </Container>
    </Box>
  );
};