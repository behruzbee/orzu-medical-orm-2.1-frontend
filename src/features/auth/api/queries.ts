import { useMutation, useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications"; // Импорт уведомлений
import { authApi } from "./apis";
import { setAuthToken } from "@/shared/api/api";
import type { LoginRequest, AuthResponse } from "../model/types";
import { useTranslation } from "@/shared/i18n";
import { isAxiosError } from "axios";

export const useLoginMutation = () => {
  const { tr } = useTranslation();
  return useMutation<AuthResponse, Error, LoginRequest>({
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
      const serverMessage = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      notifications.show({
        title: tr("Xatolik 🚨", "Ошибка 🚨"),
        message: typeof serverMessage === "string"
          ? serverMessage
          : tr("Tizimga kirib bo'lmadi", "Не удалось войти в систему"),
        color: "red",
      });
    },
  });
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
