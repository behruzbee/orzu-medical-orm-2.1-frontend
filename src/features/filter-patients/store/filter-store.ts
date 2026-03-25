import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DatesRangeValue } from '@mantine/dates';

export type FilterDateRange = [Date | null, Date | null];

interface FilterState {
  // --- Состояние (State) ---
  search: string; // 👈 ДОБАВЛЕНО: Поисковая строка
  selectedCountries: string[];
  selectedCode: string | null;
  selectedBranches: string[];
  dateRange: FilterDateRange;
  status: string | null;

  // --- Действия (Actions) ---
  setSearch: (value: string) => void; // 👈 ДОБАВЛЕНО
  setCountries: (countries: string[]) => void;
  setCode: (code: string | null) => void;
  setBranches: (branches: string[]) => void;
  setDateRange: (range: FilterDateRange | DatesRangeValue) => void;
  setStatus: (status: string | null) => void;
  
  // Сброс
  resetFilters: () => void;
  
  // Подсчет активных фильтров
  getActiveCount: () => number;
}

export const useFilterStore = create<FilterState>()(
  devtools((set, get) => ({
    // Начальные значения
    search: '', // 👈
    selectedCountries: [],
    selectedCode: null,
    selectedBranches: [],
    dateRange: [null, null],
    status: null,

    // Сеттеры
    setSearch: (search) => set({ search }), // 👈
    setCountries: (selectedCountries) => set({ selectedCountries }),
    setCode: (selectedCode) => set({ selectedCode }),
    setBranches: (selectedBranches) => set({ selectedBranches }),
    
    setDateRange: (range) => set({ dateRange: range as FilterDateRange }),
    
    setStatus: (status) => set({ status }),

    // Сброс всех фильтров в начальное состояние
    resetFilters: () => set({
      search: '', // 👈 Сбрасываем поиск тоже
      selectedCountries: [],
      selectedCode: null,
      selectedBranches: [],
      dateRange: [null, null],
      status: null,
    }),

    // Логика подсчета количества активных фильтров (для бейджика на кнопке)
    getActiveCount: () => {
      const s = get();
      let count = 0;
      
      if (s.search.trim() !== '') count++; // 👈 Считаем поиск
      if (s.selectedCountries.length > 0) count++;
      if (s.selectedCode) count++;
      if (s.selectedBranches.length > 0) count++;
      if (s.dateRange[0] || s.dateRange[1]) count++;
      if (s.status) count++;
      
      return count;
    }
  }))
);