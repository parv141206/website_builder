"use client";

import { theme } from "../../theme";
import React, { useMemo, type JSX } from "react";
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
export const Text: React.FC<TextProps> = ({
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
  const style = React.useMemo(
    () => ({
      color: color || theme.colors.text.body,
      fontFamily: fontFamily || theme.fonts.body,
      background: background || "transparent",
      fontSize: fontSize,
      fontWeight: fontWeight,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      textAlign: textAlign,
      textTransform: textTransform,
      fontStyle: italic ? "italic" : undefined,
      margin: margin,
      padding: padding,
      width: width,
      height: height,
      borderColor: borderColor,
      borderWidth: borderWidth,
      borderStyle: borderStyle,
      borderRadius: borderRadius,
      boxShadow: boxShadow,
      display: display,
    }),
    [
      theme,
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
    ],
  );
  return <Tag style={style}>{text}</Tag>;
};
