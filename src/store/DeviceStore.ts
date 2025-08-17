import { create } from "zustand";

export type Device = "desktop" | "tablet" | "mobile";

export type DeviceStore = {
  device: Device;
  setDevice: (device: Device) => void;
};

export const useDeviceStore = create<DeviceStore>((set) => ({
  device: "desktop",
  setDevice: (device) => set({ device }),
}));
