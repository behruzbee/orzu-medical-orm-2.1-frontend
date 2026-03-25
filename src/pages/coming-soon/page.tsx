import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { IconArrowLeft, IconHome, IconRocket } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const ComingSoonPage = () => {
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
          fontSize: "20vw",
          lineHeight: 1,
          position: "absolute",
          zIndex: 0,
          opacity: 0.5,
          userSelect: "none",
          letterSpacing: "-0.05em",
        }}
      >
        SOON
      </Text>

      <Container
        size="md"
        style={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <ThemeIcon variant="light"  size={80} radius={80} mb="xl">
          <IconRocket size={40} stroke={1.5} />
        </ThemeIcon>

        <Title
          order={1}
          style={{
            fontSize: 38,
            fontWeight: 900,
            marginBottom: 16,
            color: "var(--mantine-color-dark-8)",
          }}
        >
          Tez kunda ishga tushadi
        </Title>

        <Text c="dimmed" size="lg" maw={540} mx="auto" mb={30}>
          Ushbu sahifa hozirda ishlab chiqilmoqda. Biz yangi funksionallikni
          qo'shish ustida faol ishlayapmiz. Iltimos, birozdan so'ng qaytib
          ko'ring.
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
