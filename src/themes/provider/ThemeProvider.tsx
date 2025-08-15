"use client";

import React, { useEffect, type ReactNode } from "react";
import { useThemeStore } from "../store/ThemeStore";
import { ThemeContext } from "./ThemeContext";
import { applyThemeToDOM } from "../utils/applyThemeToDOM";
import { ClientOnly } from "../ClientOnly";

type Props = { children: ReactNode };

export const ThemeProvider = ({ children }: Props) => {
  const { themes, currentTheme, radius, horizontalSpacing, verticalSpacing } =
    useThemeStore();
  const theme = themes[currentTheme];

  useEffect(() => {
    applyThemeToDOM(theme!, radius, horizontalSpacing, verticalSpacing);
  }, [theme, radius, horizontalSpacing, verticalSpacing]);

  return (
    <ThemeContext.Provider
      value={{
        colors: theme!.colors,
        fonts: theme!.fonts,
        radius,
        horizontalSpacing,
        verticalSpacing,
      }}
    >
      <ClientOnly>
        <div
          style={{
            backgroundColor: theme!.colors.background.primary,
            color: theme!.colors.text.body,
            fontFamily: theme!.fonts.body,
          }}
          className="min-h-screen transition-all duration-300"
        >
          {children}
        </div>
      </ClientOnly>
    </ThemeContext.Provider>
  );
};
