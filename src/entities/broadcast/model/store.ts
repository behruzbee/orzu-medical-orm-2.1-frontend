import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BroadcastState {
  // Состояние
  messageText: string;
  selectedBranch: string | null;
  patientStatus: string[]; // Добавил в интерфейс, так как он есть в реализации
  audienceCount: number;

  // Actions
  setMessageText: (text: string) => void;
  insertVariable: (variable: string) => void;
  setBranch: (branch: string | null) => void;

  // Добавим метод для полного сброса (полезно при persist)
  resetStore: () => void;
}

export const useBroadcastStore = create<BroadcastState>()(
  persist(
    (set) => ({
      messageText: "",
      selectedBranch: null,
      patientStatus: ["active"],
      audienceCount: 154,

      setMessageText: (text) => set({ messageText: text }),

      insertVariable: (variable) =>
        set((state) => ({
          messageText: state.messageText + ` ${variable} `,
        })),

      setBranch: (selectedBranch) => set({ selectedBranch }),

      resetStore: () =>
        set({
          messageText: "",
          selectedBranch: null,
          patientStatus: ["active"],
          audienceCount: 154,
        }),
    }),
    {
      name: "broadcast-campaign-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messageText: state.messageText,
      }),
    }
  )
);
