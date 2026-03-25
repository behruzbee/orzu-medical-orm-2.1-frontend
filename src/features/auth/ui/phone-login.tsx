import { useState } from "react";
import {
  Stack,
  Button,
  Text,
  PinInput,
  Alert,
  Center,
  Box,
  InputBase,
} from "@mantine/core";
import { IMaskInput } from "react-imask";
import { IconPhone, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/app-paths";
import { useLoginMutation } from "../api/queries"; // Импорт нашего хука

export const PhoneLogin = () => {
  const navigate = useNavigate();

  // Подключаем мутацию
  const { mutate, isPending, error } = useLoginMutation();

  const [step, setStep] = useState<"input" | "pin">("input");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const handleNextStep = () => {
    if (phone.length < 17) return;
    setStep("pin");
  };

  const handleLogin = () => {
    mutate(
      {
        method: "pin",
        phone: phone
          .replaceAll(/\s/g, "")
          .replaceAll("(", "")
          .replaceAll(")", "")
          .replaceAll("-", ""), // Приводим к формату +998901234567
        pin: pin,
      },
      {
        onSuccess: () => {
          // Токен уже сохранен в queries.ts, делаем редирект
          navigate(APP_PATHS.HOME.HOME_PATH);
        },
      }
    );
  };

  return (
    <Stack gap="lg" py="xs">
      {error && (
        <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />}>
          {/* @ts-ignore - axios error structure */}
          {error?.response?.data?.message || "Xatolik yuz berdi"}
        </Alert>
      )}

      {step === "input" ? (
        <>
          <Box>
            <Text size="sm" fw={500} mb={4}>
              Telefon raqamingiz
            </Text>
            <InputBase<any>
              size="md"
              placeholder="+998 (00) 000-00-00"
              leftSection={<IconPhone size={18} />}
              component={IMaskInput}
              mask="+998 (00) 000-00-00"
              value={phone}
              onAccept={(val: string) => setPhone(val)}
              radius="md"
            />
          </Box>
          <Button
            fullWidth
            size="md"
            onClick={handleNextStep}
            radius="md"
            disabled={phone.length < 17}
          >
            Davom etish
          </Button>
        </>
      ) : (
        <>
          <Alert
            variant="light"
            title="PIN Kod"
            icon={<IconCheck size={16} />}
            color="blue"
          >
            Iltimos, shaxsiy <b>5 xonali</b> PIN kodingizni kiriting.
          </Alert>

          <Stack gap="xs" align="center">
            <Text size="sm" fw={500}>
              PIN kod
            </Text>
            <PinInput
              size="xl"
              length={5}
              mask
              autoFocus
              type="number"
              value={pin}
              onChange={setPin}
              disabled={isPending}
            />
          </Stack>

          <Button
            fullWidth
            size="md"
            onClick={handleLogin}
            loading={isPending}
            radius="md"
            disabled={pin.length < 5}
          >
            Kirish
          </Button>

          <Center>
            <Button
              variant="subtle"
              size="xs"
              color="gray"
              onClick={() => {
                setStep("input");
                setPin("");
              }}
              disabled={isPending}
            >
              Raqamni o'zgartirish
            </Button>
          </Center>
        </>
      )}
    </Stack>
  );
};
