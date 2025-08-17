"use client";

import React, { useMemo } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";

export type ButtonProps = {
  text: string;
  background?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string | number;
  fontFamily?: string;
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted";
  boxShadow?: string;
};

export const Button: React.FC<ButtonProps> & { craft?: any } = ({
  text,
  background,
  color,
  fontSize,
  fontWeight,
  fontFamily,
  margin,
  padding,
  width,
  height,
  borderRadius,
  borderWidth,
  borderColor,
  borderStyle = "none",
  boxShadow,
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));
  const theme = useTheme();

  const style: React.CSSProperties = useMemo(
    () => ({
      background: background || theme.colors.primary,
      color: color || theme.colors.text.onPrimary || "#ffffff",
      fontSize: fontSize || "16px",
      fontWeight: fontWeight || "bold",
      fontFamily: fontFamily || theme.fonts.body,
      padding: padding || "12px 24px",
      borderRadius: borderRadius || "8px",
      borderWidth,
      borderColor,
      borderStyle,
      boxShadow,
      margin,
      width,
      height,
      cursor: "pointer",
      textAlign: "center",
      outline: selected ? "2px dashed #4c8bf5" : undefined,
      outlineOffset: "2px",
      transition: "outline 120ms ease, background-color 120ms ease",
    }),
    [
      background,
      color,
      fontSize,
      fontWeight,
      fontFamily,
      margin,
      padding,
      width,
      height,
      borderRadius,
      borderWidth,
      borderColor,
      borderStyle,
      boxShadow,
      selected,
      theme,
    ],
  );

  return (
    <button
      ref={(ref) => connect(drag(ref as HTMLButtonElement))}
      style={style}
    >
      {text}
    </button>
  );
};

Button.craft = {
  displayName: "Button",
  props: {
    text: "Click Me",
  } satisfies ButtonProps,
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [{ key: "text", type: "text", label: "Text" }],
        },
        {
          label: "Appearance",
          fields: [
            { key: "background", type: "color", label: "Background" },
            { key: "color", type: "color", label: "Text Color" },
            { key: "fontSize", type: "text", label: "Font Size" },
            { key: "fontWeight", type: "text", label: "Font Weight" },
            { key: "fontFamily", type: "text", label: "Font Family" },
          ],
        },
        {
          label: "Layout & Spacing",
          fields: [
            { key: "width", type: "text", label: "Width" },
            { key: "height", type: "text", label: "Height" },
            { key: "margin", type: "text", label: "Margin" },
            { key: "padding", type: "text", label: "Padding" },
          ],
        },
        {
          label: "Border & Shadow",
          fields: [
            { key: "borderRadius", type: "text", label: "Radius" },
            { key: "borderWidth", type: "text", label: "Border Width" },
            { key: "borderColor", type: "color", label: "Border Color" },
            {
              key: "borderStyle",
              type: "select",
              label: "Border Style",
              options: ["none", "solid", "dashed", "dotted"],
            },
            { key: "boxShadow", type: "text", label: "Shadow" },
          ],
        },
      ],
    },
  },
};
