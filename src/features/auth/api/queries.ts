import { useMutation, useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications"; // Импорт уведомлений
import { authApi } from "./apis";
import { setAuthToken } from "@/shared/api/api";
import type { LoginRequest, AuthResponse } from "../model/types";
import { useEffect, useState } from "react";
import { useTranslation } from "@/shared/i18n";

export const useLoginMutation = () => {
  const { tr } = useTranslation();
  return useMutation<AuthResponse, any, LoginRequest>({
    mutationKey: ["auth", "login"],
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      notifications.show({
        title: tr("Muvaffaqiyatli! 🎉", "Успешно! 🎉"),
        message: tr(
          "Tizimga muvaffaqiyatli kirdingiz.",
          "Вы успешно вошли в систему.",
        ),
        color: "green",
      });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      notifications.show({
        title: tr("Xatolik 🚨", "Ошибка 🚨"),
        message:
          error.response?.data?.message ||
          tr("Tizimga kirib bo'lmadi", "Не удалось войти в систему"),
        color: "red",
      });
    },
  });
};

export const useQrStream = () => {
  const { tr } = useTranslation();
  const [qrCode, setQrCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = authApi.getQrStreamUrl();
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.qr) {
          setQrCode(data.qr);
          setError(null);
        }
      } catch (e) {
        console.error("Error parsing QR SSE:", e);
      }
    };

    eventSource.onerror = (e) => {
      console.error("SSE Error:", e);
      setError(
        tr(
          "Tizimda faol sessiya mavjud yoki ulanishda xatolik.",
          "В системе уже есть активная сессия или произошла ошибка подключения.",
        ),
      );
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [tr]);

  return { qrCode, error };
};

export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!localStorage.getItem("token"),
  });
};
