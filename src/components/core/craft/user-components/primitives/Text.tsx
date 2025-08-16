"use client";
import React, { useMemo, useRef, useState, type JSX } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";

export type TextAlign =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "start"
  | "end";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
export type TextProps = {
  text: string;
  as?: keyof JSX.ElementType;
  color?: string;
  fontSize?: string;
  fontWeight?: number | "normal" | "bold" | "lighter" | "bolder";
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: TextAlign;
  textTransform?: TextTransform;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
  background?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted" | "double";
  borderRadius?: string;
  boxShadow?: string;
  display?: string;
};

export const Text: React.FC<TextProps> & {
  craft?: any;
} = ({
  text,
  as: Tag = "p",
  color,
  fontSize,
  fontWeight,
  fontFamily,
  lineHeight,
  letterSpacing,
  textAlign,
  textTransform,
  italic,
  underline,
  strike,
  margin,
  padding,
  width,
  height,
  background,
  borderColor,
  borderWidth,
  borderStyle = "none",
  borderRadius,
  boxShadow,
  display,
}) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const theme = useTheme();
  const ref = useRef<HTMLElement | null>(null);
  const [editing, setEditing] = useState(false);

  const style: React.CSSProperties = useMemo(
    () => ({
      // Use the prop if it exists, otherwise fall back to the theme value.
      color: color || theme.colors.text.body,
      fontFamily: fontFamily || theme.fonts.body,
      background: background || "transparent",

      // Other props
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      textAlign,
      textTransform,
      fontStyle: italic ? "italic" : undefined,
      textDecoration:
        [
          underline ? "underline" : undefined,
          strike ? "line-through" : undefined,
        ]
          .filter(Boolean)
          .join(" ") || undefined,
      margin,
      padding,
      width,
      height,
      borderColor,
      borderWidth,
      borderStyle,
      borderRadius,
      boxShadow,
      display,
      // Editor-specific styles
      outline: selected && !editing ? "2px dashed #4c8bf5" : undefined,
      outlineOffset: "2px",
      cursor: "text",
    }),
    [
      theme, // Add theme to dependency array
      color,
      fontSize,
      fontWeight,
      fontFamily,
      lineHeight,
      letterSpacing,
      textAlign,
      textTransform,
      italic,
      underline,
      strike,
      margin,
      padding,
      width,
      height,
      background,
      borderColor,
      borderWidth,
      borderStyle,
      borderRadius,
      boxShadow,
      display,
      selected,
      editing,
    ],
  );

  const onDoubleClick = () => setEditing(true);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newText = e.currentTarget.innerText;
    setProp((props: TextProps) => (props.text = newText), 500);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.currentTarget.blur();
    }
  };

  const commonProps = {
    ref: (el: HTMLElement | null) => {
      if (el) {
        ref.current = el;
        connect(drag(el));
      }
    },
    style,
    onDoubleClick,
  };

  return editing ? (
    <Tag
      {...(commonProps as any)}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  ) : (
    <Tag {...(commonProps as any)}>{text}</Tag>
  );
};

Text.craft = {
  displayName: "Text",
  props: {
    text: "Double-click to edit me",
    as: "p",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "1.5",
    textAlign: "left",
  } satisfies TextProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [
            { key: "text", type: "textarea", label: "Text" },
            {
              key: "as",
              type: "select",
              label: "Tag",
              options: ["div", "p", "span", "h1", "h2", "h3", "h4"],
            },
          ],
        },
        {
          label: "Typography",
          fields: [
            { key: "color", type: "color", label: "Color" },
            { key: "fontSize", type: "text", label: "Font Size" },
            { key: "fontWeight", type: "text", label: "Font Weight" },
            { key: "fontFamily", type: "text", label: "Font Family" },
            { key: "lineHeight", type: "text", label: "Line Height" },
            { key: "letterSpacing", type: "text", label: "Letter Spacing" },
            {
              key: "textAlign",
              type: "select",
              label: "Text Align",
            },
            {
              key: "textTransform",
              type: "select",
              label: "Transform",
            },

            {
              key: "fontStyleToggles",
              type: "custom-toggle-group",
              label: "Style",
              children: [
                {
                  key: "fontWeight",
                  label: "Bold",
                  valueMap: { on: "bold", off: "normal" },
                },
                { key: "italic", label: "Italic" },
                { key: "underline", label: "Underline" },
                { key: "strike", label: "Strikethrough" },
              ],
            },
          ],
        },
        {
          label: "Box",
          fields: [
            { key: "margin", type: "text", label: "Margin" },
            { key: "padding", type: "text", label: "Padding" },
            { key: "width", type: "text", label: "Width" },
            { key: "height", type: "text", label: "Height" },
            { key: "background", type: "color", label: "Background" },
            { key: "borderColor", type: "color", label: "Border Color" },
            { key: "borderWidth", type: "text", label: "Border Width" },
            {
              key: "borderStyle",
              type: "select",
              label: "Border Style",
              options: ["none", "solid", "dashed", "dotted", "double"],
            },
            { key: "borderRadius", type: "text", label: "Radius" },
            { key: "boxShadow", type: "text", label: "Shadow" },
            { key: "display", type: "text", label: "Display" },
          ],
        },
      ],
    },
  },
};
