import { useMutation, useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications"; // Импорт уведомлений
import { authApi } from "./apis";
import { setAuthToken } from "@/shared/api/api";
import type { LoginRequest, AuthResponse } from "../model/types";
import { useEffect, useState } from "react";

export const useLoginMutation = () => {
  return useMutation<AuthResponse, any, LoginRequest>({
    mutationKey: ["auth", "login"],
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      notifications.show({
        title: "Muvaffaqiyatli! 🎉",
        message: "Tizimga muvaffaqiyatli kirdingiz.",
        color: "green",
      });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      notifications.show({
        title: "Xatolik 🚨",
        message:
          error.response?.data?.message ||
          "Authentication failed (Client/Network Error)",
        color: "red",
      });
    },
  });
};

export const useQrStream = () => {
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
      setError("Tizimda faol sessiya mavjud yoki ulanishda xatolik.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

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
