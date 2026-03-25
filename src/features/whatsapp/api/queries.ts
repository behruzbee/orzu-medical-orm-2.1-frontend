import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { whatsappApi } from "./apis";
import { patientKeys } from "@/entities/patient/api";

export const whatsappKeys = {
  history: (phone: string) => ["whatsapp", "history", phone] as const,
};

export const useWhatsappHistory = (phone: string) => {
  return useQuery({
    queryKey: whatsappKeys.history(phone),
    queryFn: () => whatsappApi.getHistory(phone),
    enabled: !!phone,
    refetchInterval: 3000,
  });
};

export const useWhatsappSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApi.sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: whatsappKeys.history(variables.phone),
      });
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.phone),
      });
    },
  });
};
