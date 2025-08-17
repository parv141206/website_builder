"use client";

import { useEditor } from "@craftjs/core";
import { useEffect } from "react";

export const useEditorHotkeys = () => {
  const { actions, selected, canUndo, canRedo } = useEditor((state, query) => {
    const [selectedId] = state.events.selected;
    return {
      selected: selectedId,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    };
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // --- UNDO/REDO ---
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          console.log("redo");
          if (canRedo) actions.history.redo();
        } else {
          if (canUndo) actions.history.undo();
        }
      }

      // --- DELETE COMPONENT ---
      if (e.key === "Delete" && selected) {
        // Prevent the browser from navigating back on backspace
        e.preventDefault();

        // Don't delete the ROOT node
        if (selected !== "ROOT") {
          actions.delete(selected);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [actions, selected, canUndo, canRedo]);
};
