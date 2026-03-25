import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  patientsApi,
  type AddCallStatusPayload,
  type AddFeedbackPayload,
} from "./apis";
import type { PatientsQueryParams } from "../model/types";

export const patientKeys = {
  all: ["patients"] as const,
  list: (params: PatientsQueryParams) => ["patients", "list", params] as const,
  detail: (id: string) => ["patients", "detail", id] as const,
  stats: () => ["patients", "stats"],
};

export const usePatients = (params: PatientsQueryParams) => {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientsApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
};

export const useRevertPatientStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientsApi.revertStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
      notifications.show({
        title: "Status qaytarildi",
        message: "Bemor bilan ishlashni davom ettirishingiz mumkin",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Xatolik",
        message: "Muddat o'tib ketgan bo'lishi mumkin",
        color: "red",
      });
    },
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });
};

export const useAddCallStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddCallStatusPayload;
    }) => patientsApi.addCallStatus(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });

      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: patientKeys.stats(),
      });

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

export const usePatientStats = () => {
  return useQuery({
    queryKey: patientKeys.stats(),
    queryFn: () => patientsApi.getStats(),
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
      id: string;
      payload: AddFeedbackPayload;
    }) => patientsApi.addFeedback(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: patientKeys.stats(),
      });

      notifications.show({
        title: "Shikoyat saqlandi",
        message: "Bemor fikri muvaffaqiyatli ro'yxatga olindi",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Xatolik",
        message: "Shikoyatni saqlashda xatolik yuz berdi",
        color: "red",
      });
    },
  });
};

// 5. Удаление пациента
export const useDeletePatientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientsApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });

      notifications.show({
        title: "O'chirildi",
        message: "Bemor va barcha ma'lumotlar o'chirildi",
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
