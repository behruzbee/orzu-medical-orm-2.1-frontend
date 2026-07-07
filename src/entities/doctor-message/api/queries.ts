import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  doctorMessagesApi,
  type CreateDoctorMessagePayload,
} from "./apis";

export const doctorMessageKeys = {
  all: ["doctor-messages"] as const,
  pending: () => ["doctor-messages", "pending"] as const,
};

export const usePendingDoctorMessages = (enabled = true) => {
  return useQuery({
    queryKey: doctorMessageKeys.pending(),
    queryFn: doctorMessagesApi.getPending,
    enabled,
    refetchInterval: enabled ? 10000 : false,
    refetchOnWindowFocus: true,
  });
};

export const useSendDoctorMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: CreateDoctorMessagePayload;
    }) => doctorMessagesApi.create(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorMessageKeys.all });

      notifications.show({
        title: "Xabar yuborildi",
        message: "Shifokor kabinetida ogohlantirish ochiladi.",
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Xatolik",
        message:
          error?.response?.data?.message || "Shifokorga xabar yuborilmadi",
        color: "red",
      });
    },
  });
};

export const useMarkDoctorMessageDoneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => doctorMessagesApi.markDone(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: doctorMessageKeys.pending(),
      });

      notifications.show({
        title: "Bajarildi",
        message: "Shifokor xabari yopildi.",
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Xatolik",
        message: error?.response?.data?.message || "Xabarni yopib bo'lmadi",
        color: "red",
      });
    },
  });
};
