"use client";

import React, { useMemo } from "react";
import { useNode } from "@craftjs/core";

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

export const Image: React.FC<ImageProps> & { craft?: any } = ({
  src,
  alt,
  objectFit = "cover",
  width = "100%",
  height = "200px",
  margin,
  padding,
  borderRadius,
  boxShadow,
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const style: React.CSSProperties = useMemo(
    () => ({
      width,
      height,
      margin,
      padding,
      borderRadius,
      boxShadow,
      objectFit,
      outline: selected ? "2px dashed #4c8bf5" : undefined,
      outlineOffset: "2px",
      transition: "outline 120ms ease",
    }),
    [
      width,
      height,
      margin,
      padding,
      borderRadius,
      boxShadow,
      objectFit,
      selected,
    ],
  );

  return (
    <img
      ref={(ref) => connect(drag(ref as HTMLImageElement))}
      src={src || "https://via.placeholder.com/400x200"}
      alt={alt}
      style={style}
    />
  );
};

Image.craft = {
  displayName: "Image",
  props: {
    src: "https://images.unsplash.com/photo-1554629947-334ff61d85dc",
    alt: "Mountain landscape",
    objectFit: "cover",
    width: "100%",
    height: "200px",
    borderRadius: "8px",
  } satisfies ImageProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [
            { key: "src", type: "text", label: "Image URL" },
            { key: "alt", type: "text", label: "Alt Text" },
          ],
        },
        {
          label: "Appearance",
          fields: [
            {
              key: "objectFit",
              type: "select",
              label: "Fit",
              options: ["cover", "contain", "fill", "none", "scale-down"],
            },
            { key: "width", type: "text", label: "Width" },
            { key: "height", type: "text", label: "Height" },
            { key: "borderRadius", type: "text", label: "Radius" },
            { key: "boxShadow", type: "text", label: "Shadow" },
          ],
        },
        {
          label: "Spacing",
          fields: [
            { key: "margin", type: "text", label: "Margin" },
            { key: "padding", type: "text", label: "Padding" },
          ],
        },
      ],
    },
  },
};
