"use client";

import React, { useMemo } from "react";
import { theme } from "../../theme"; // The props definition, including all possible style options.
export type ContainerProps = {
  as?: React.ElementType;
  // layout
  display?: "block" | "flex" | "grid" | "inline-block" | "inline-flex" | "inline-grid";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  alignItems?: "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
  alignContent?: "stretch" | "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
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
export const Container: React.FC<ContainerProps> & {
  craft?: any;
} = ({
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
  background,
  // This prop comes from the settings panel
  borderColor,
  borderWidth,
  borderStyle = "none",
  borderRadius,
  boxShadow,
  color,
  // This prop comes from the settings panel
  fontFamily,
  // This prop comes from the settings panel
  fontSize,
  children
}) => {
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
      fontFamily: fontFamily || theme.fonts.body

      // Editor-specific styles that will be removed by the API route.
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
  display, flexDirection, flexWrap, justifyContent, alignItems, alignContent, gap, rowGap, columnGap, gridTemplateColumns, gridTemplateRows, gridAutoFlow, width, height, minWidth, minHeight, maxWidth, maxHeight, margin, padding, background, borderColor, borderWidth, borderStyle, borderRadius, boxShadow, color, fontFamily, fontSize]);
  return <Tag style={style}>{children}</Tag>;
};

// This section defines the component's behavior in the Craft.js editor.
// It does not need to change.