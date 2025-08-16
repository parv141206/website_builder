"use client";
import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { useThemeStore } from "~/themes/store/ThemeStore";

export const TopBar = () => {
  const { query } = useEditor();
  const [isLoading, setIsLoading] = useState(false);
  // Get the currentTheme name directly from the store's state
  const { themes, currentTheme, radius, horizontalSpacing, verticalSpacing } =
    useThemeStore.getState();

  const handleExport = async () => {
    setIsLoading(true);
    const pageState = query.serialize();

    const activeThemePayload = {
      ...themes[currentTheme], // Send the full theme object for generating the layout
      radius,
      horizontalSpacing,
      verticalSpacing,
    };

    const seo = {
      title: "My Exported Page",
      description: "This is a page exported from my website builder.",
      keywords: "nextjs, react, export",
    };

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ⭐ KEY CHANGE: Send the theme object AND the theme name
        body: JSON.stringify({
          pageState,
          theme: activeThemePayload,
          themeName: currentTheme, // e.g., "light"
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
    <div className="z-10 flex items-center justify-between bg-gray-800 p-3 text-white shadow-md">
      <h1 className="text-lg font-semibold">Page Editor</h1>
      <button
        onClick={handleExport}
        disabled={isLoading}
        className="rounded bg-blue-600 px-4 py-2 font-bold text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-500"
      >
        {isLoading ? "Exporting..." : "Export Project"}
      </button>
    </div>
  );
};
