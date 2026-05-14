import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  requestsApi,
  type AddCallStatusPayload,
  type AddFeedbackPayload,
} from "./apis";
import type { RequestsQueryParams } from "../model/types";

export const requestKeys = {
  all: ["requests"] as const,
  list: (params: RequestsQueryParams) => ["requests", "list", params] as const,
  detail: (id: string) => ["requests", "detail", id] as const,
  stats: () => ["requests", "stats"],
};

export const useRequests = (params: RequestsQueryParams) => {
  return useQuery({
    queryKey: requestKeys.list(params),
    queryFn: () => requestsApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
};

export const useRequest = (id: string) => {
  return useQuery({
    queryKey: requestKeys.detail(id),
    queryFn: () => requestsApi.getById(id),
    enabled: !!id,
  });
};

export const useRevertRequestStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestsApi.revertStatus(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: requestKeys.stats() });
      
      notifications.show({
        title: "Status qaytarildi",
        message: data.message || "Bemor bilan ishlashni davom ettirishingiz mumkin",
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Xatolik",
        message: error?.response?.data?.message || "Muddat o'tib ketgan bo'lishi mumkin",
        color: "red",
      });
    },
  });
};

export const useAddCallStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string; // requestId
      payload: AddCallStatusPayload;
    }) => requestsApi.addCallStatus(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: requestKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: requestKeys.stats() });

      notifications.show({
        title: "Status yangilandi",
        message: "Qo'ng'iroq natijasi muvaffaqiyatli saqlandi",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Xatolik",
        message: "Statusni o'zgartirishda xatolik yuz berdi",
        color: "red",
      });
    },
  });
};

export const useRequestStats = () => {
  return useQuery({
    queryKey: requestKeys.stats(),
    queryFn: () => requestsApi.getStats(),
    refetchOnWindowFocus: true,
  });
};

export const useAddFeedbackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string; // requestId
      payload: AddFeedbackPayload;
    }) => requestsApi.addFeedback(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: requestKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: requestKeys.stats() });

      notifications.show({
        title: "Fikr saqlandi",
        message: "Bemor fikri muvaffaqiyatli ro'yxatga olindi",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Xatolik",
        message: "Fikrni saqlashda xatolik yuz berdi",
        color: "red",
      });
    },
  });
};

export const useDeleteRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => requestsApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: requestKeys.stats() });

      notifications.show({
        title: "O'chirildi",
        message: "Ariza muvaffaqiyatli o'chirildi",
        color: "gray",
      });
    },
    onError: () => {
      notifications.show({
        title: "Xatolik",
        message: "O'chirish imkoniyati yo'q",
        color: "red",
      });
    },
  });
};