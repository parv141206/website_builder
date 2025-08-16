"use client";

import React, { useState, memo } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

export const CustomColorPicker = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (color: string) => void;
  }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleClick = () => setDisplayColorPicker(!displayColorPicker);
    const handleClose = () => setDisplayColorPicker(false);
    const handleChange = (color: string) => onChange(color);

    const popover: React.CSSProperties = {
      position: "absolute",
      zIndex: 20,
      right: 0,
      bottom: "calc(100% + 8px)",
    };

    const cover: React.CSSProperties = {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 10,
    };

    return (
      <div className="relative">
        {/* Swatch */}
        <div
          onClick={handleClick}
          className="h-8 w-full cursor-pointer rounded-md border border-gray-300 p-1"
        >
          <div
            style={{ backgroundColor: value || "#000000" }}
            className="h-full w-full rounded-[3px]"
          />
        </div>

        {displayColorPicker ? (
          <>
            {/* Backdrop (click anywhere outside to close) */}
            <div style={cover} onClick={handleClose} />

            {/* Picker itself */}
            <div style={popover}>
              <div className="flex w-56 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                <HexColorPicker color={value} onChange={handleChange} />

                <div className="flex items-center gap-2 border-t border-gray-200 pt-3">
                  <span className="text-sm font-medium text-gray-500">#</span>
                  <HexColorInput
                    color={value}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 bg-gray-50 p-1 font-mono text-sm text-gray-800 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    prefixed={false}
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  },
);

CustomColorPicker.displayName = "CustomColorPicker";
