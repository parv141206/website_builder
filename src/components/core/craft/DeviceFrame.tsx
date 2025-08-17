"use client";
import React from "react";
import { Frame } from "@craftjs/core";
import { useDeviceStore } from "~/store/DeviceStore";

const deviceWidths: Record<string, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

type DeviceFrameProps = {
  children?: React.ReactNode; // Make children optional since we might not need them when loading JSON
  savedJson: string | null;
};

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  savedJson,
}) => {
  const { device } = useDeviceStore();
  const width = deviceWidths[device] || "100%";

  return (
    <div
      className="mx-auto h-full w-full overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out"
      style={{ maxWidth: width }}
    >
      <div className="h-full w-full overflow-y-auto">
        {savedJson ? (
          // When loading from JSON, don't pass children - let Frame deserialize the JSON
          <Frame json={savedJson} />
        ) : (
          // Only use children when there's no saved JSON (first load)
          <Frame>{children}</Frame>
        )}
      </div>
    </div>
  );
};
