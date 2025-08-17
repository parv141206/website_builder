"use client";

import { theme } from "../../theme";
import React, { useMemo } from "react";
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
export const Button: React.FC<ButtonProps> = ({
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
  const style: React.CSSProperties = useMemo(
    () => ({
      background: background ?? theme.colors.primary,
      color: (color ?? theme.colors.text.onPrimary) || "#ffffff",
      fontSize: fontSize ?? "16px",
      fontWeight: fontWeight ?? "bold",
      fontFamily: fontFamily ?? theme.fonts.body,
      padding: padding ?? "12px 24px",
      borderRadius: borderRadius ?? "8px",
      borderWidth,
      borderColor,
      borderStyle,
      boxShadow,
      margin,
      width,
      height,
      textAlign: "center",
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
    ],
  );
  return <button style={style}>{text}</button>;
};
