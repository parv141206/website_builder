"use client";

import React, { useMemo, useRef, useState, type JSX } from "react";
import { theme } from "../../theme";
export type TextAlign = "left" | "center" | "right" | "justify" | "start" | "end";
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
  display
}) => {
  const style: React.CSSProperties = useMemo(() => ({
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
    textDecoration: [underline ? "underline" : undefined, strike ? "line-through" : undefined].filter(Boolean).join(" ") || undefined,
    margin,
    padding,
    width,
    height,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius,
    boxShadow,
    display
    // Editor-specific styles
  }), [
  // Add theme to dependency array
  color, fontSize, fontWeight, fontFamily, lineHeight, letterSpacing, textAlign, textTransform, italic, underline, strike, margin, padding, width, height, background, borderColor, borderWidth, borderStyle, borderRadius, boxShadow, display]);
  return <Tag style={style}>{text}</Tag>;
};