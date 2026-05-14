import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RequestStatus } from "@/entities/patient"; // Убедитесь, что импорт правильный

interface BroadcastState {
  // Сообщение
  messageText: string;
  
  // Фильтры
  branch: string | null;
  phoneCode: string | null;
  status: RequestStatus | null;
  dateRange: [Date | null, Date | null];

  // Действия для фильтров
  setBranch: (branch: string | null) => void;
  setPhoneCode: (code: string | null) => void;
  setStatus: (status: RequestStatus | null) => void;
  setDateRange: (range: [Date | null, Date | null]) => void;

  // Действия для текста
  setMessageText: (text: string) => void;
  insertVariable: (variable: string) => void;
  resetStore: () => void;
}

export const useBroadcastStore = create<BroadcastState>()(
  persist(
    (set) => ({
      messageText: "",
      
      // Изначально фильтры пустые
      branch: null,
      phoneCode: null,
      status: null,
      dateRange: [null, null],

      setMessageText: (text) => set({ messageText: text }),
      insertVariable: (variable) => set((state) => ({ messageText: state.messageText + ` ${variable} ` })),

      setBranch: (branch) => set({ branch }),
      setPhoneCode: (phoneCode) => set({ phoneCode }),
      setStatus: (status) => set({ status }),
      setDateRange: (dateRange) => set({ dateRange }),

      resetStore: () =>
        set({
          messageText: "",
          branch: null,
          phoneCode: null,
          status: null,
          dateRange: [null, null],
        }),
    }),
    {
      name: "broadcast-campaign-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ messageText: state.messageText }), // Сохраняем только текст при перезагрузке
    }
  )
);