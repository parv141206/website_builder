import type { Theme } from "../store/ThemeStore";

export const applyThemeToDOM = (
  theme: Theme,
  radius: string,
  horizontalSpacing: string,
  verticalSpacing: string,
) => {
  const root = document.documentElement;

  // background layers
  Object.entries(theme.colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--color-bg-${key}`, value);
  });

  // text roles
  Object.entries(theme.colors.text).forEach(([key, value]) => {
    if (value) root.style.setProperty(`--color-text-${key}`, value);
  });

  // primary/secondary
  root.style.setProperty("--color-primary", theme.colors.primary);
  root.style.setProperty("--color-secondary", theme.colors.secondary);

  // borders, card colors, hover states
  if (theme.colors.border) {
    root.style.setProperty("--color-border", theme.colors.border);
  }
  if (theme.colors.card) {
    Object.entries(theme.colors.card).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--color-card-${key}`, value);
    });
  }
  if (theme.colors.hover) {
    Object.entries(theme.colors.hover).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--color-hover-${key}`, value);
    });
  }

  // semantic roles
  Object.entries(theme.colors.roles).forEach(([key, value]) => {
    root.style.setProperty(`--color-role-${key}`, value);
  });

  // fonts
  root.style.setProperty("--font-heading", theme.fonts.heading);
  root.style.setProperty("--font-body", theme.fonts.body);

  // layout
  root.style.setProperty("--global-radius", radius);
  root.style.setProperty("--spacing-x", horizontalSpacing);
  root.style.setProperty("--spacing-y", verticalSpacing);
};
