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
import { useTranslation } from "@/shared/i18n";

export const PhoneLogin = () => {
  const { tr } = useTranslation();
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
      },
    );
  };

  return (
    <Stack gap="lg" py="xs">
      {error && (
        <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />}>
          {/* @ts-ignore - axios error structure */}
          {error?.response?.data?.message ||
            tr("Xatolik yuz berdi", "Произошла ошибка")}
        </Alert>
      )}

      {step === "input" ? (
        <>
          <Box>
            <Text size="sm" fw={500} mb={4}>
              {tr("Telefon raqamingiz", "Ваш номер телефона")}
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
            {tr("Davom etish", "Продолжить")}
          </Button>
        </>
      ) : (
        <>
          <Alert
            variant="light"
            title={tr("PIN Kod", "PIN-код")}
            icon={<IconCheck size={16} />}
            color="blue"
          >
            {tr(
              "Iltimos, shaxsiy 5 xonali PIN kodingizni kiriting.",
              "Введите ваш личный 5-значный PIN-код.",
            )}
          </Alert>

          <Stack gap="xs" align="center">
            <Text size="sm" fw={500}>
              {tr("PIN kod", "PIN-код")}
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
            {tr("Kirish", "Войти")}
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
              {tr("Raqamni o'zgartirish", "Изменить номер")}
            </Button>
          </Center>
        </>
      )}
    </Stack>
  );
};
