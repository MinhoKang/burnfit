import { ThemeMode } from '../types/theme';

export const COLORS = {
  LIGHT_BLUE: '#12C1E8',
  BLUE: '#4F78A1',
  RED: '#D16763',
  DARK_GRAY: '#4E4E4E',
  LIGHT_GRAY: '#E3E6EA',
  GRAY: '#BFC3C4',
  NAVY: '#34424B',

  LIGHT: {
    BACKGROUND: '#FFFFFF',
    TEXT: '#000000',
    TEXT_SECONDARY: '#4E4E4E',
    CARD_BACKGROUND: '#FFFFFF',
    BORDER: '#E3E6EA',
  },
  DARK: {
    BACKGROUND: '#121212',
    TEXT: '#FFFFFF',
    TEXT_SECONDARY: '#B0B0B0',
    CARD_BACKGROUND: '#1E1E1E',
    BORDER: '#2C2C2C',
  },
};

export const getThemeColors = (mode: ThemeMode) => {
  return mode === 'light' ? COLORS.LIGHT : COLORS.DARK;
};
