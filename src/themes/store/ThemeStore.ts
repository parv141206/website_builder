import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { defaultThemes } from "../config/defaultThemes";
import { googleFonts } from "./googleFonts";

export type Theme = {
  name: string;
  colors: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
      quinary: string;
    };
    text: {
      heading: string;
      subheading: string;
      body: string;
      muted: string;
      onPrimary?: string;
      onSecondary?: string;
    };
    primary: string;
    secondary: string;
    border?: string;
    card?: {
      background: string;
      foreground: string;
      border?: string;
      hoverBackground?: string;
    };
    hover?: {
      primary?: string;
      secondary?: string;
    };
    roles: {
      success: string;
      danger: string;
      warning: string;
      info: string;
    };
  };
  fonts: {
    heading: string;
    body: string;
  };
};

export type ThemeStore = {
  themes: Record<string, Theme>;
  currentTheme: string;
  radius: string;
  horizontalSpacing: string;
  verticalSpacing: string;

  setTheme: (themeName: string) => void;
  setThemeFromJson: (theme: Theme) => void;
  setRadius: (radius: string) => void;
  setHorizontalSpacing: (spacing: string) => void;
  setVerticalSpacing: (spacing: string) => void;
  updateFont: (key: keyof Theme["fonts"], value: string | number) => void;
  getCurrentTheme: () => Theme;
  resetTheme: () => void;
};

// -----------------------------
// Persistence helpers
// -----------------------------
const loadState = (): Partial<ThemeStore> => {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem("themeStore");
    return data ? (JSON.parse(data) as Partial<ThemeStore>) : {};
  } catch (e) {
    console.error("Failed to load themeStore from localStorage", e);
    return {};
  }
};

const saveState = (state: Partial<ThemeStore>) => {
  try {
    localStorage.setItem("themeStore", JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save themeStore", e);
  }
};

// -----------------------------
// Store
// -----------------------------
export const useThemeStore = create<ThemeStore>()(
  subscribeWithSelector<ThemeStore>((set, get) => {
    const initial: ThemeStore = {
      themes: defaultThemes,
      currentTheme: "artisan",
      radius: "16px",
      horizontalSpacing: "0px",
      verticalSpacing: "0px",
      ...loadState(),

      setTheme: (themeName) => {
        const { themes } = get();
        if (themes[themeName]) {
          set({ currentTheme: themeName });
        } else {
          console.warn(`Theme "${themeName}" does not exist`);
        }
      },

      setThemeFromJson: (theme) => {
        set((state: ThemeStore) => ({
          themes: {
            ...state.themes,
            [theme.name]: theme,
          },
          currentTheme: theme.name,
        }));
      },

      setRadius: (radius) => {
        const value = radius.endsWith("px") ? radius : `${radius}px`;
        set({ radius: value });
      },

      setHorizontalSpacing: (spacing) => {
        const value = spacing.endsWith("px") ? spacing : `${spacing}px`;
        set({ horizontalSpacing: value });
      },

      setVerticalSpacing: (spacing) => {
        const value = spacing.endsWith("px") ? spacing : `${spacing}px`;
        set({ verticalSpacing: value });
      },

      updateFont: (key, value) => {
        const theme = get().getCurrentTheme();
        const updatedFonts = { ...theme.fonts, [key]: String(value) };
        set((state: ThemeStore) => ({
          themes: {
            ...state.themes,
            [state.currentTheme]: {
              ...theme,
              fonts: updatedFonts,
            },
          },
        }));
      },

      getCurrentTheme: () => get().themes[get().currentTheme]!,

      resetTheme: () => {
        const resetState: ThemeStore = {
          themes: defaultThemes,
          currentTheme: "light",
          radius: "16px",
          horizontalSpacing: "24px",
          verticalSpacing: "24px",
          setTheme: initial.setTheme,
          setThemeFromJson: initial.setThemeFromJson,
          setRadius: initial.setRadius,
          setHorizontalSpacing: initial.setHorizontalSpacing,
          setVerticalSpacing: initial.setVerticalSpacing,
          updateFont: initial.updateFont,
          getCurrentTheme: initial.getCurrentTheme,
          resetTheme: initial.resetTheme,
        };
        set(resetState);
        saveState(resetState);
      },
    };

    return initial;
  }),
);

// -----------------------------
// Persistence subscription
// -----------------------------
useThemeStore.subscribe(
  (state: ThemeStore) => ({
    themes: state.themes,
    currentTheme: state.currentTheme,
    radius: state.radius,
    horizontalSpacing: state.horizontalSpacing,
    verticalSpacing: state.verticalSpacing,
  }),
  (newState: Partial<ThemeStore>) => saveState(newState),
);
