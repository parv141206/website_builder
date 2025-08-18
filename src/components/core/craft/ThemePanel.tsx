"use client";

import React from "react";
import { useThemeStore, type Theme } from "~/themes/store/ThemeStore";
import { FontPicker } from "./SettingsPanel";
import { Plus, RotateCcw } from "lucide-react";
import { CustomColorPicker } from "./utils/CustomColorPicker";

const ThemeSetting = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-2 items-center gap-4">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <div className="w-full">{children}</div>
  </div>
);

export const ThemePanel = () => {
  const {
    themes,
    currentTheme,
    updateColor,
    updateFont,
    radius,
    setRadius,
    addNewTheme,
    resetCurrentTheme,
  } = useThemeStore();

  const activeTheme = themes[currentTheme];

  if (!activeTheme) return null;

  const handleAddNewTheme = () => {
    const newName = prompt("Enter a name for the new theme:");
    if (newName) {
      addNewTheme(newName.toLowerCase().trim());
    }
  };

  const handleResetTheme = () => {
    if (
      confirm(
        `Are you sure you want to reset the "${currentTheme}" theme to its default values?`,
      )
    ) {
      resetCurrentTheme();
    }
  };

  const renderColorPicker = (
    label: string,
    category: keyof Theme["colors"],
    key: string,
  ) => {
    const value = (activeTheme.colors as any)[category][key];
    return (
      <ThemeSetting label={label}>
        <CustomColorPicker
          value={value}
          onChange={(newColor) => updateColor(category, key, newColor)}
        />
      </ThemeSetting>
    );
  };

  return (
    <aside className="w-80 overflow-y-auto border-l border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Theme Manager</h3>
          <p className="text-sm text-gray-500">
            Editing:{" "}
            <span className="font-medium text-blue-600 capitalize">
              {currentTheme}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            title="Add New Theme (based on current)"
            onClick={handleAddNewTheme}
            className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            title="Reset Current Theme"
            onClick={handleResetTheme}
            className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-red-600"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md mb-2 border-b pb-1 font-medium text-gray-600">
          Background Colors
        </h4>
        <div className="mt-2 space-y-3">
          {renderColorPicker("Primary BG", "background", "primary")}
          {renderColorPicker("Secondary BG", "background", "secondary")}
          {renderColorPicker("Tertiary BG", "background", "tertiary")}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md mb-2 border-b pb-1 font-medium text-gray-600">
          Text Colors
        </h4>
        <div className="mt-2 space-y-3">
          {renderColorPicker("Heading", "text", "heading")}
          {renderColorPicker("Body", "text", "body")}
          {renderColorPicker("Muted", "text", "muted")}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md mb-2 border-b pb-1 font-medium text-gray-600">
          Accent Colors
        </h4>
        <div className="mt-2 space-y-3">
          <ThemeSetting label="Primary">
            <CustomColorPicker
              value={activeTheme.colors.primary}
              onChange={(newColor) => updateColor(null, "primary", newColor)}
            />
          </ThemeSetting>
          <ThemeSetting label="Secondary">
            <CustomColorPicker
              value={activeTheme.colors.secondary}
              onChange={(newColor) => updateColor(null, "secondary", newColor)}
            />
          </ThemeSetting>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md mb-2 border-b pb-1 font-medium text-gray-600">
          Fonts
        </h4>
        <div className="mt-2 space-y-3">
          <ThemeSetting label="Heading Font">
            <FontPicker
              value={activeTheme.fonts.heading}
              onChange={(font) => updateFont("heading", font)}
            />
          </ThemeSetting>
          <ThemeSetting label="Body Font">
            <FontPicker
              value={activeTheme.fonts.body}
              onChange={(font) => updateFont("body", font)}
            />
          </ThemeSetting>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md mb-2 border-b pb-1 font-medium text-gray-600">
          Global Styles
        </h4>
        <div className="mt-2 space-y-3">
          <ThemeSetting label="Border Radius">
            <input
              type="text"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </ThemeSetting>
        </div>
      </div>
    </aside>
  );
};
