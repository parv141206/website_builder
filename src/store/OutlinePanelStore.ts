import { create } from "zustand";

export type OutlinePanelStore = {
  isOutlinePanelOpen: boolean;
  setOutlinePanelOpen: (open: boolean) => void;
  toggleOutlinePanel: () => void;
};

export const useOutlinePanelStore = create<OutlinePanelStore>((set) => ({
  isOutlinePanelOpen: true,
  setOutlinePanelOpen: (open) => set({ isOutlinePanelOpen: open }),
  toggleOutlinePanel: () =>
    set((state) => ({ isOutlinePanelOpen: !state.isOutlinePanelOpen })),
}));
