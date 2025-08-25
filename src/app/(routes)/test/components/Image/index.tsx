"use client";

import { theme } from "../../theme";
import { useRef } from "react";
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
  const containerRef = useRef(null);
  const style: React.CSSProperties = useMemo(() => ({
    width,
    height,
    margin,
    padding,
    borderRadius,
    boxShadow,
    objectFit,
    transition: "outline 120ms ease"
  }), [width, height, margin, padding, borderRadius, boxShadow, objectFit]);
  return <img ref={el => {
    containerRef.current = el;
  }} src={src || "https://via.placeholder.com/400x200"} alt={alt} style={style} />;
};