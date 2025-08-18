import React, { memo, useState } from "react";
import { useEditor } from "@craftjs/core";
import { useThemeStore, type Theme } from "~/themes/store/ThemeStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Undo2,
  Redo2,
  Trash2,
  Monitor,
  Tablet,
  Smartphone,
  Settings,
  Palette,
  Image,
} from "lucide-react";
import { useDeviceStore, type Device } from "~/store/DeviceStore";
import { useAppStateStore } from "~/store/AppStateStore";
import { useCurrentTheme } from "~/themes/hooks/useCurrentTheme";
import { SeoModal } from "./utils/SeoModal";
import { LuFolderTree } from "react-icons/lu";
import { useOutlinePanelStore } from "~/store/OutlinePanelStore";
import { db } from "./image-manager/ImageManager";

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
          className="h-4 w-4 rounded-full border border-neutral-400/50"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

const DeviceSelector = memo(() => {
  const { device, setDevice } = useDeviceStore();

  const options = [
    { value: "desktop", label: "Desktop", icon: Monitor },
    { value: "tablet", label: "Tablet", icon: Tablet },
    { value: "mobile", label: "Mobile", icon: Smartphone },
  ];

  return (
    <div className="flex items-center rounded-md bg-neutral-100 p-0.5">
      {options.map((option) => {
        const isActive = device === option.value;
        return (
          <button
            key={option.value}
            title={option.label}
            onClick={() => setDevice(option.value as Device)}
            className={`rounded-[5px] p-2 text-neutral-500 transition-colors hover:bg-white hover:text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              isActive ? "!bg-white !text-blue-600 shadow-sm" : ""
            }`}
          >
            <option.icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
});
DeviceSelector.displayName = "DeviceSelector";

export const ThemeSelector = () => {
  const { themes, currentTheme, setTheme } = useThemeStore();
  const themeKeys = Object.keys(themes).filter(Boolean);

  return (
    <Select
      value={currentTheme}
      onValueChange={(themeName) => setTheme(themeName)}
    >
      <SelectTrigger className="w-60 border-neutral-300 bg-neutral-100/80 text-sm text-neutral-800 ring-offset-white focus:ring-blue-500">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent className="border-neutral-200 bg-white text-neutral-800">
        {themeKeys.map((key) => {
          const theme = themes[key];
          return (
            <SelectItem
              key={key}
              value={key}
              className="focus:bg-blue-50 focus:text-blue-600"
            >
              <div className="flex items-center gap-3">
                <ThemePalette theme={theme!} />
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
  const { actions, canUndo, canRedo, selected, query } = useEditor(
    (state, query) => {
      const [selectedId] = state.events.selected;
      return {
        canUndo: query.history.canUndo(),
        canRedo: query.history.canRedo(),
        selected: selectedId,
        query,
      };
    },
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isThemeManagerOpen, setIsThemeManagerOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);

  const { themes, currentTheme, radius, horizontalSpacing, verticalSpacing } =
    useThemeStore.getState();
  const theme = useCurrentTheme;

  const handleExport = async (seo: {
    title: string;
    description: string;
    keywords: string;
  }) => {
    setIsLoading(true);
    try {
      const storedImages = await db.table("images").toArray();
      const imageData = storedImages.map((img) => ({
        key: img.key,
        base64: img.base64,
      }));
      console.log("Image Data: ", imageData);
      const pageState = query.serialize();

      const activeThemePayload = {
        ...themes[currentTheme],
        radius,
        horizontalSpacing,
        verticalSpacing,
      };

      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageState,
          theme: activeThemePayload,
          themeName: currentTheme,
          seo,
          imageData,
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

  const handleDelete = () => {
    if (selected && selected !== "ROOT") {
      actions.delete(selected);
    }
  };
  const { setActivePanel, activePanel } = useAppStateStore();
  const { isOutlinePanelOpen, toggleOutlinePanel } = useOutlinePanelStore();
  return (
    <>
      <header className="z-50 grid h-16 grid-cols-3 items-center border-b border-neutral-200 bg-white px-6 shadow-sm">
        <div className="flex items-center justify-start gap-3">
          <h1 className="text-lg font-semibold tracking-wide text-neutral-800">
            Page Editor
          </h1>
          <button
            title="Outline Manager"
            onClick={toggleOutlinePanel}
            className={`rounded-md ${
              isOutlinePanelOpen ? "bg-gray-100" : ""
            } p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-blue-600`}
          >
            <LuFolderTree className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <DeviceSelector />
          <button
            title="Undo (Ctrl+Z)"
            onClick={() => actions.history.undo()}
            disabled={!canUndo}
            className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:text-neutral-300 disabled:hover:bg-transparent"
          >
            <Undo2 className="h-5 w-5" />
          </button>
          <button
            title="Redo (Ctrl+Shift+Z)"
            onClick={() => actions.history.redo()}
            disabled={!canRedo}
            className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:text-neutral-300 disabled:hover:bg-transparent"
          >
            <Redo2 className="h-5 w-5" />
          </button>
          <button
            title="Delete (Del)"
            onClick={handleDelete}
            disabled={!selected || selected === "ROOT"}
            className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:text-neutral-300 disabled:hover:bg-transparent"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-4">
          <ThemeSelector />
          <button
            title="Manage Theme"
            onClick={() =>
              setActivePanel(activePanel === "theme" ? "hide" : "theme")
            }
            className={`rounded-md ${
              activePanel === "theme" ? "bg-gray-100" : ""
            } p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-blue-600`}
          >
            <Palette className="h-5 w-5" />
          </button>

          <button
            title="Image Manager"
            onClick={() =>
              setActivePanel(activePanel === "images" ? "hide" : "images")
            }
            className={`rounded-md ${
              activePanel === "images" ? "bg-gray-100" : ""
            } p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-blue-600`}
          >
            <Image className="h-5 w-5" />
          </button>

          <button
            title="Settings Manager"
            onClick={() =>
              setActivePanel(activePanel === "settings" ? "hide" : "settings")
            }
            className={`rounded-md ${
              activePanel === "settings" ? "bg-gray-100" : ""
            } p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-blue-600`}
          >
            <Settings className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsSeoModalOpen(true)}
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? "Exporting..." : "Export Project"}
          </button>
        </div>
      </header>
      <SeoModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        onSubmit={handleExport}
      />
    </>
  );
};
