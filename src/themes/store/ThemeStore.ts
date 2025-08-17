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
  getCurrentTheme: () => Theme;
  resetTheme: () => void;
  updateColor: (
    category: keyof Theme["colors"] | null,
    key: string,
    value: string,
  ) => void;
  updateFont: (key: keyof Theme["fonts"], value: string) => void;
  addNewTheme: (newName: string) => void;
  resetCurrentTheme: () => void;
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
      updateColor: (category, key, value) => {
        const { themes, currentTheme } = get();
        const newThemes = { ...themes };
        const themeToUpdate = { ...newThemes[currentTheme] };

        if (category) {
          (themeToUpdate.colors as any)[category] = {
            ...(themeToUpdate.colors as any)[category],
            [key]: value,
          };
        } else {
          (themeToUpdate.colors as any)[key] = value;
        }

        newThemes[currentTheme] = themeToUpdate;
        set({ themes: newThemes });
      },
      updateFont: (key, value) => {
        const { themes, currentTheme } = get();
        const newThemes = { ...themes };
        const themeToUpdate = { ...newThemes[currentTheme] };

        themeToUpdate.fonts[key] = value;

        newThemes[currentTheme] = themeToUpdate;
        set({ themes: newThemes });
      },
      setTheme: (themeName) => {
        const { themes } = get();
        if (themes[themeName]) {
          set({ currentTheme: themeName });
        } else {
          console.warn(`Theme "${themeName}" does not exist`);
        }
      },
      addNewTheme: (newName) => {
        if (!newName || get().themes[newName]) {
          alert("Invalid or duplicate theme name.");
          return;
        }
        const { themes, currentTheme } = get();
        const currentThemeObject = themes[currentTheme];

        const newTheme = {
          ...JSON.parse(JSON.stringify(currentThemeObject)), // Deep copy the current theme
          name: newName,
        };

        set({
          themes: {
            ...themes,
            [newName]: newTheme,
          },
          currentTheme: newName,
        });
      },

      resetCurrentTheme: () => {
        const { themes, currentTheme } = get();
        const originalTheme = defaultThemes[currentTheme];

        if (originalTheme) {
          set({
            themes: {
              ...themes,
              [currentTheme]: originalTheme,
            },
          });
        } else {
          alert("Cannot reset a custom theme to default.");
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
