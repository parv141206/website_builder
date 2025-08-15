import { useThemeStore, type ThemeStore } from "../store/ThemeStore";

export const useCurrentTheme = () => {
  return useThemeStore((s: ThemeStore) => s.themes[s.currentTheme]);
};
