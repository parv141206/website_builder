"use client";

import { useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
        console.log("saved");
        toast("Saved!");
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
        const parsedState = JSON.parse(savedState);

        const componentTypes = Object.values(parsedState)
          .map((node: any) => node.type?.resolvedName)
          .filter(Boolean);

        setSavedJson(savedState);
      } else {
        setSavedJson(null);
      }
    } catch (error) {
      localStorage.removeItem(EDITOR_STATE_KEY);
      setSavedJson(null);
    }

    setIsLoaded(true);
  }, []);

  const clearSavedState = () => {
    localStorage.removeItem(EDITOR_STATE_KEY);
    setSavedJson(null);
  };

  return {
    isLoaded,
    savedJson,
    clearSavedState,
  };
};
