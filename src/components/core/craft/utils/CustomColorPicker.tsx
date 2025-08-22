"use client";

import React, { useState, memo, useRef, useEffect } from "react";
import { HexAlphaColorPicker, toHex } from "react-colorful";
import { HexColorInput } from "react-colorful";

export const CustomColorPicker = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (color: string) => void;
  }) => {
    const [hex, setHex] = useState(value);

    const popoverRef = useRef<HTMLDivElement>(null);

    const [opensUp, setOpensUp] = useState(true);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.top < 350) {
        setOpensUp(false);
      } else {
        setOpensUp(true);
      }
      setDisplayColorPicker(true);
    };

    const handleClose = () => setDisplayColorPicker(false);
    const handleChange = (color: string) => {
      setHex(color);
    };

    useEffect(() => {
      onChange(hex);
    }, [hex, onChange]);

    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    // Styles for the popover (now dynamic)
    const popover: React.CSSProperties = {
      position: "absolute",
      zIndex: 10,
      right: 0,
      ...(opensUp
        ? { bottom: "calc(100% + 8px)" }
        : { top: "calc(100% + 8px)" }),
    };
    const cover: React.CSSProperties = {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    };

    return (
      <div className="relative">
        <div
          onClick={handleClick}
          className="h-8 w-full cursor-pointer rounded-md border border-gray-300 p-1"
        >
          <div
            style={{ backgroundColor: hex || "#000000" }}
            className="h-full w-full rounded-[3px]"
          />
        </div>

        {displayColorPicker ? (
          <div style={popover} ref={popoverRef}>
            <div style={cover} onClick={handleClose} />
            <div
              className="flex w-56 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <HexAlphaColorPicker color={hex} onChange={handleChange} />
              <div className="flex items-center gap-2 border-t border-gray-200 pt-3">
                <span className="text-sm font-medium text-gray-500">#</span>
                <HexColorInput
                  color={hex}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 bg-gray-50 p-1 font-mono text-sm text-gray-800 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  prefixed={false}
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);

CustomColorPicker.displayName = "CustomColorPicker";
