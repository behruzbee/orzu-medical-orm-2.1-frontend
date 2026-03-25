import { useState } from "react";
import {
  Grid,
  Box,
  Stack,
  Title,
  Text,
  Paper,
  Center,
  SegmentedControl,
  ThemeIcon,
  rem,
} from "@mantine/core";
import {
  IconQrcode,
  IconDeviceMobile,
  IconHeartbeat,
} from "@tabler/icons-react";
import { QrLogin } from "@/features/auth/ui/qr-login";
import { PhoneLogin } from "@/features/auth/ui/phone-login";

export const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState("phone");

  return (
    <Grid gutter={0} style={{ minHeight: "100vh" }}>
      <Grid.Col span={{ base: 0, md: 6 }} visibleFrom="md">
        <Box
          style={{
            height: "100vh",
            backgroundImage:
              "url(https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://orzumed.uz/wp-content/uploads/2025/05/igloukol.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Box
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(50, 184, 20, 0.65) 0%, rgba(21, 184, 32, 0.67) 100%)",
            }}
          />

          <Stack
            style={{
              position: "absolute",
              bottom: 60,
              left: 60,
              right: 60,
              color: "white",
            }}
            gap="sm"
          >
            <Title order={1} style={{ fontSize: rem(32) }}>
              Orzu Medical CRM-ga xush kelibsiz
            </Title>
            <Text size="lg" style={{ opacity: 0.9, lineHeight: 1.5 }}>
              Bemorlarni boshqarishning mukammal tizimi yordamida tibbiy
              faoliyatingizni samarali tashkil qiling.
            </Text>
          </Stack>
        </Box>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }} bg="gray.0">
        <Center h="100%" p="md">
          <Stack align="center" gap="lg" w="100%" maw={400}>
            <Stack align="center" gap={4}>
              <ThemeIcon size={50} radius="md" variant="filled" mb="xs">
                <IconHeartbeat size={30} />
              </ThemeIcon>
              <Title order={2}>Tizimga kirish</Title>
              <Text c="dimmed" size="sm">
                Shaxsiy kabinetingizga kiring
              </Text>
            </Stack>

            <Paper shadow="md" radius="lg" p="xl" w="100%" bg="white">
              <SegmentedControl
                fullWidth
                radius="md"
                mb="xl"
                value={loginMethod}
                onChange={setLoginMethod}
                color="brand"
                data={[
                  {
                    value: "phone",
                    label: (
                      <Center style={{ gap: 10 }}>
                        <IconDeviceMobile size={16} />
                        <span>Telefon raqam</span>
                      </Center>
                    ),
                  },
                  {
                    value: "qr",
                    label: (
                      <Center style={{ gap: 10 }}>
                        <IconQrcode size={16} />
                        <span>QR Kod</span>
                      </Center>
                    ),
                  },
                ]}
              />

              {loginMethod === "qr" ? <QrLogin /> : <PhoneLogin />}
            </Paper>
          </Stack>
        </Center>
      </Grid.Col>
    </Grid>
  );
};
