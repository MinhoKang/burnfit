import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand/react';

export type StartDayOfWeek = 'sunday' | 'monday';

interface SettingsState {
  startOfWeek: StartDayOfWeek;
  setStartOfWeek: (day: StartDayOfWeek) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      startOfWeek: 'sunday',
      setStartOfWeek: day => set({ startOfWeek: day }),
    }),
    {
      name: 'calendar-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
