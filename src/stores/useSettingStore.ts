import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand/react';
import { ThemeMode } from '../types/theme';

export type StartDayOfWeek = 'sunday' | 'monday';

interface SettingsState {
  startOfWeek: StartDayOfWeek;
  setStartOfWeek: (day: StartDayOfWeek) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      startOfWeek: 'sunday',
      setStartOfWeek: day => set({ startOfWeek: day }),
      themeMode: 'light',
      setThemeMode: mode => set({ themeMode: mode }),
    }),
    {
      name: 'calendar-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
