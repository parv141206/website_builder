"use client";

import { theme } from "../../theme";
import React, { useMemo } from "react";
export type ImageProps = {
  src: string;
  alt: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  borderRadius?: string;
  boxShadow?: string;
};
export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  objectFit = "cover",
  width = "100%",
  height = "200px",
  margin,
  padding,
  borderRadius,
  boxShadow
}) => {
  const style: React.CSSProperties = useMemo(() => ({
    width,
    height,
    margin,
    padding,
    borderRadius,
    boxShadow,
    objectFit
  }), [width, height, margin, padding, borderRadius, boxShadow, objectFit]);
  return <img src={src || "https://via.placeholder.com/400x200"} alt={alt} style={style} />;
};