import { create } from "zustand";

export type ActivePanel = "settings" | "theme";

export type AppStateStore = {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
};

export const useAppStateStore = create<AppStateStore>((set) => ({
  activePanel: "settings",
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
