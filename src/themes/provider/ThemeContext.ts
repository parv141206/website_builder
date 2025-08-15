"use client";

import { createContext, useContext } from "react";
import type { Theme } from "../store/ThemeStore";

export type ThemeContextProps = {
  colors: Theme["colors"];
  fonts: Theme["fonts"];
  radius: string;
  horizontalSpacing: string;
  verticalSpacing: string;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export { ThemeContext };
