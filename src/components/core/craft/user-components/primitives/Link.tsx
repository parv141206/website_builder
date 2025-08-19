"use client";

import React, { useMemo, useRef, useState } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";
import { type TextProps } from "./Typography/Text";
export type LinkProps = TextProps & {
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

export const Link: React.FC<LinkProps> & {
  craft?: any;
} = ({ text, href, target = "_self", color, ...props }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const theme = useTheme();
  const [editing, setEditing] = useState(false);

  const style: React.CSSProperties = useMemo(
    () => ({
      color: color || theme.colors.primary,
      ...props,
      outline: selected && !editing ? "2px dashed #4c8bf5" : undefined,
      outlineOffset: "2px",
      cursor: "pointer",
    }),
    [color, props, selected, editing, theme],
  );

  const onDoubleClick = () => setEditing(true);
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setProp(
      (props: LinkProps) => (props.text = e.currentTarget.innerText),
      500,
    );
    setEditing(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !e.shiftKey) e.currentTarget.blur();
  };

  return (
    <a
      ref={(ref) => connect(drag(ref as HTMLAnchorElement))}
      href={href}
      target={target}
      style={style}
      onDoubleClick={onDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      contentEditable={editing}
      suppressContentEditableWarning
    >
      {text}
    </a>
  );
};

Link.craft = {
  displayName: "Link",
  props: {
    text: "Click here",
    href: "#",
    target: "_self",
  } satisfies LinkProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [
            { key: "text", type: "text", label: "Link Text" },
            { key: "href", type: "text", label: "URL" },
            {
              key: "target",
              type: "select",
              label: "Target",
              options: ["_self", "_blank", "_parent", "_top"],
            },
          ],
        },
        {
          label: "Typography",
          fields: [
            { key: "color", type: "color", label: "Color" },
            { key: "fontSize", type: "text", label: "Font Size" },
          ],
        },
      ],
    },
  },
};
