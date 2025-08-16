"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { useThemeStore, type Theme } from "~/themes/store/ThemeStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const ThemePalette = ({ theme }: { theme: Theme }) => {
  if (!theme) return null;
  const keyColors = [
    theme.colors.background.primary,
    theme.colors.background.secondary,
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.text.heading,
    theme.colors.text.body,
  ];
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {keyColors.map((color, index) => (
        <div
          key={index}
          className="h-4 w-4 rounded-full border border-neutral-300/20"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export const ThemeSelector = () => {
  const { themes, currentTheme, setTheme } = useThemeStore();
  const themeKeys = Object.keys(themes).filter(Boolean);

  return (
    <Select
      value={currentTheme}
      onValueChange={(themeName) => setTheme(themeName)}
    >
      <SelectTrigger className="w-60 border-neutral-300 text-sm text-black">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent className="border-neutral-300 text-black">
        {themeKeys.map((key) => {
          const theme = themes[key];
          return (
            <SelectItem
              key={key}
              value={key}
              className="focus:bg-sky-500/20 focus:text-black"
            >
              <div className="flex items-center gap-3">
                <ThemePalette theme={theme} />
                <span className="capitalize">{key}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export const TopBar = () => {
  const { query } = useEditor();
  const [isLoading, setIsLoading] = useState(false);
  const { themes, currentTheme, radius, horizontalSpacing, verticalSpacing } =
    useThemeStore.getState();

  const handleExport = async () => {
    setIsLoading(true);
    const pageState = query.serialize();
    const activeThemePayload = {
      ...themes[currentTheme],
      radius,
      horizontalSpacing,
      verticalSpacing,
    };
    const seo = {
      title: "My Exported Page",
      description: "A page exported from my website builder.",
      keywords: "nextjs, react, export",
    };

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageState,
          theme: activeThemePayload,
          themeName: currentTheme,
          seo,
        }),
      });
      if (response.ok) {
        alert("Project exported successfully!");
      } else {
        const errorData = await response.json();
        alert(`Export failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("An unexpected error occurred during export.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="z-50 flex h-16 items-center justify-between gap-4 border-b border-neutral-300 px-6 text-black shadow-md">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-wide">NexoraHub</h1>
        <div className="text-xl">|</div>
        <div className="text-md">Theme</div>
        <ThemeSelector />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-green-200 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-green-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? "Exporting..." : "Export Project"}
        </button>
      </div>
    </header>
  );
};
