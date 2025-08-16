"use client";
import React, { useMemo } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";

// The props definition, including all possible style options.
export type ContainerProps = {
  as?: React.ElementType;
  // layout
  display?:
    | "block"
    | "flex"
    | "grid"
    | "inline-block"
    | "inline-flex"
    | "inline-grid";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
  alignContent?:
    | "stretch"
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  gap?: string;
  rowGap?: string;
  columnGap?: string;

  // grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridAutoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";

  // box
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;

  margin?: string;
  padding?: string;
  background?: string;

  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted" | "double";
  borderRadius?: string;
  boxShadow?: string;

  // text defaults
  color?: string;
  fontFamily?: string;
  fontSize?: string;

  // canvas flag is via craft config
  children?: React.ReactNode;
};

export const Container: React.FC<ContainerProps> & { craft?: any } = ({
  as: Tag = "div",
  display = "flex",
  flexDirection = "column",
  flexWrap,
  justifyContent,
  alignItems,
  alignContent,
  gap,
  rowGap,
  columnGap,
  gridTemplateColumns,
  gridTemplateRows,
  gridAutoFlow,

  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,

  margin,
  padding,
  background, // This prop comes from the settings panel
  borderColor,
  borderWidth,
  borderStyle = "none",
  borderRadius,
  boxShadow,

  color, // This prop comes from the settings panel
  fontFamily, // This prop comes from the settings panel
  fontSize,

  children,
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  // Get the current theme object from the context for default fallbacks.
  const theme = useTheme();
  console.log(background);
  const style: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      // Pass all layout and box-model props directly.
      display,
      flexDirection,
      flexWrap,
      justifyContent,
      alignItems,
      alignContent,
      gridTemplateColumns,
      gridTemplateRows,
      gridAutoFlow,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      margin,
      padding,
      borderColor,
      borderWidth,
      borderStyle,
      borderRadius,
      boxShadow,
      fontSize,

      // CRITICAL LOGIC: Use the prop if it's provided, otherwise fall back to the theme.
      // The API route will specifically transform this pattern during export.
      background: background || theme.colors.background.primary,
      color: color || theme.colors.text.body,
      fontFamily: fontFamily || theme.fonts.body,

      // Editor-specific styles that will be removed by the API route.
      outline: selected ? "2px dashed #4c8bf5" : undefined,
      outlineOffset: "2px",
      transition: "outline 120ms ease",
    };

    // Special handling for gap properties to avoid conflicts.
    if (gap) {
      baseStyle.gap = gap;
    } else {
      baseStyle.rowGap = rowGap;
      baseStyle.columnGap = columnGap;
    }

    return baseStyle;
  }, [
    // Include all props and the `theme` object in the dependency array.
    display,
    flexDirection,
    flexWrap,
    justifyContent,
    alignItems,
    alignContent,
    gap,
    rowGap,
    columnGap,
    gridTemplateColumns,
    gridTemplateRows,
    gridAutoFlow,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    margin,
    padding,
    background,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius,
    boxShadow,
    color,
    fontFamily,
    fontSize,
    selected,
    theme, // Essential for reacting to live theme changes.
  ]);

  return (
    <Tag ref={(ref: any) => connect(drag(ref))} style={style}>
      {children}
    </Tag>
  );
};

// This section defines the component's behavior in the Craft.js editor.
// It does not need to change.
Container.craft = {
  displayName: "Container",
  props: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px",
    width: "100%",
  } satisfies ContainerProps,
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
  },
  isCanvas: true,
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Layout",
          fields: [
            {
              key: "display",
              type: "select",
              label: "Display",
              options: [
                "block",
                "flex",
                "grid",
                "inline-block",
                "inline-flex",
                "inline-grid",
              ],
            },
            {
              key: "flexDirection",
              type: "select",
              label: "Flex Direction",
              options: ["row", "column", "row-reverse", "column-reverse"],
            },
            {
              key: "flexWrap",
              type: "select",
              label: "Flex Wrap",
              options: ["nowrap", "wrap", "wrap-reverse"],
              allowUndefined: true,
            },
            {
              key: "justifyContent",
              type: "select",
              label: "Justify",
              options: [
                "flex-start",
                "center",
                "flex-end",
                "space-between",
                "space-around",
                "space-evenly",
              ],
              allowUndefined: true,
            },
            {
              key: "alignItems",
              type: "select",
              label: "Align Items",
              options: [
                "stretch",
                "flex-start",
                "center",
                "flex-end",
                "baseline",
              ],
              allowUndefined: true,
            },
            {
              key: "alignContent",
              type: "select",
              label: "Align Content",
              options: [
                "stretch",
                "flex-start",
                "center",
                "flex-end",
                "space-between",
                "space-around",
              ],
              allowUndefined: true,
            },
            { key: "gap", type: "text", label: "Gap" },
            { key: "rowGap", type: "text", label: "Row Gap" },
            { key: "columnGap", type: "text", label: "Column Gap" },
            { key: "gridTemplateColumns", type: "text", label: "Grid Columns" },
            { key: "gridTemplateRows", type: "text", label: "Grid Rows" },
            {
              key: "gridAutoFlow",
              type: "select",
              label: "Grid Auto Flow",
              options: ["row", "column", "dense", "row dense", "column dense"],
              allowUndefined: true,
            },
          ],
        },
        {
          label: "Box",
          fields: [
            { key: "width", type: "text", label: "Width" },
            { key: "height", type: "text", label: "Height" },
            { key: "minWidth", type: "text", label: "Min Width" },
            { key: "minHeight", type: "text", label: "Min Height" },
            { key: "maxWidth", type: "text", label: "Max Width" },
            { key: "maxHeight", type: "text", label: "Max Height" },
            { key: "margin", type: "text", label: "Margin" },
            { key: "padding", type: "text", label: "Padding" },
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
          ],
        },
        {
          label: "Typography",
          fields: [
            { key: "color", type: "color", label: "Text Color" },
            { key: "fontFamily", type: "text", label: "Font Family" },
            { key: "fontSize", type: "text", label: "Font Size" },
          ],
        },
      ],
    },
  },
};
