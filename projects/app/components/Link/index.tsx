"use client";

import { theme } from "../../theme";
import React, { useMemo } from "react";
import { type TextProps } from "./Text";
export type LinkProps = TextProps & {
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};
export const Link: React.FC<LinkProps> = ({
  text,
  href,
  target = "_self",
  color,
  ...props
}) => {
  const style: React.CSSProperties = useMemo(() => ({
    color: color || theme.colors.primary,
    ...props
  }), [color, props, theme]);
  return <a href={href} target={target} style={style}>
      {text}
    </a>;
};