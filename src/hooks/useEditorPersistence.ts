"use client";

import { useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";

const EDITOR_STATE_KEY = "craftjs-editor-state";

export const useEditorPersistence = () => {
  const { query } = useEditor();
  const [savedJson, setSavedJson] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const jsonState = query.serialize();
        localStorage.setItem(EDITOR_STATE_KEY, jsonState);
        console.log("✅ Editor state saved!");
        console.log("📄 Saved state preview:", JSON.parse(jsonState));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [query]);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(EDITOR_STATE_KEY);
      console.log("🔍 Checking localStorage for saved state...");

      if (savedState) {
        console.log("✅ Found saved state in localStorage");
        const parsedState = JSON.parse(savedState);
        console.log("📊 Parsed state structure:", Object.keys(parsedState));

        const componentTypes = Object.values(parsedState)
          .map((node: any) => node.type?.resolvedName)
          .filter(Boolean);
        console.log("🧩 Components in saved state:", [
          ...new Set(componentTypes),
        ]);

        setSavedJson(savedState);
        console.log("✅ savedJson state updated with localStorage data");
      } else {
        console.log("ℹ️ No saved state found, will use default children");
        setSavedJson(null);
      }
    } catch (error) {
      console.error("❌ Error loading saved state:", error);
      localStorage.removeItem(EDITOR_STATE_KEY);
      setSavedJson(null);
    }

    setIsLoaded(true);
    console.log("✅ Loading process complete, isLoaded = true");
  }, []);

  const clearSavedState = () => {
    localStorage.removeItem(EDITOR_STATE_KEY);
    setSavedJson(null);
    console.log("🗑️ Saved state cleared!");
  };

  return {
    isLoaded,
    savedJson,
    clearSavedState,
  };
};
