// src/components/core/craft/primitives/Button.tsx
"use client";
import React, { useMemo } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes"; // Assuming you have a theme context

export type ButtonProps = {
  text: string;
  onClick?: () => void;
  href?: string; // ADDED: href prop for link behavior
  target?: "_self" | "_blank" | "_parent" | "_top"; // ADDED: target for links
  className?: string; // For Tailwind classes
  padding?: string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string | number;
  width?: string;
  height?: string;
  border?: string;
  boxShadow?: string;
};

export const Button: React.FC<ButtonProps> & { craft?: any } = ({
  text,
  onClick,
  href, // DESTRUCTURED: href prop
  target, // DESTRUCTURED: target prop
  className,
  padding = "12px 24px",
  backgroundColor,
  color,
  borderRadius = "8px",
  fontSize = "16px",
  fontWeight = "bold",
  width = "fit-content",
  height = "auto",
  border = "none",
  boxShadow = "none",
  ...props
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));
  const theme = useTheme();

  const style: React.CSSProperties = useMemo(
    () => ({
      padding,
      backgroundColor: backgroundColor || theme.colors.primary, // Example default from theme
      color: color || theme.colors.text.onPrimary, // Example default from theme
      borderRadius,
      fontSize,
      fontWeight,
      width,
      height,
      border,
      boxShadow,
      cursor: "pointer",
      display: "inline-flex", // Ensure it can be styled nicely for text and padding
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none", // For link functionality, remove default underline
      transition: "all 0.2s ease-in-out",
    }),
    [
      padding,
      backgroundColor,
      theme,
      color,
      borderRadius,
      fontSize,
      fontWeight,
      width,
      height,
      border,
      boxShadow,
    ],
  );

  // Determine the tag based on whether an href is provided
  const Tag = href ? "a" : "button";

  // Combine external and internal class names, adding selected state outline
  const finalClassNames = useMemo(() => {
    const classes = [className];
    if (selected) {
      classes.push(
        "outline-2",
        "outline-dashed",
        "outline-blue-500",
        "outline-offset-2",
        "relative",
        "z-10",
      );
    }
    // Add any default Tailwind classes you want for the button/link
    classes.push("hover:opacity-90", "active:scale-95");
    return classes.filter(Boolean).join(" ");
  }, [className, selected]);

  return (
    <Tag
      ref={(el) => connect(drag(el as HTMLElement))} // Cast to HTMLElement for connect/drag
      onClick={onClick}
      className={finalClassNames}
      style={style}
      // Only apply href and target if Tag is 'a'
      {...(href && { href, target })}
      {...props} // Pass through other HTML button/anchor props
    >
      {text}
    </Tag>
  );
};

Button.craft = {
  displayName: "Button",
  props: {
    text: "Click Me",
    padding: "12px 28px",
    backgroundColor: undefined,
    color: undefined,
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    width: "fit-content",
    height: "auto",
    href: undefined, // Default to undefined (renders as button)
    target: "_self",
    className: "bg-blue-600 text-white hover:bg-blue-700 transition-colors", // Example Tailwind default
  } satisfies ButtonProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Button/Link Settings",
          fields: [
            { key: "text", type: "text", label: "Text" },
            {
              key: "href",
              type: "text",
              label: "Link URL (optional)",
              // Show target only if href is set
            },
            {
              key: "target",
              type: "select",
              label: "Link Target",
              options: ["_self", "_blank", "_parent", "_top"],
              if: (props: ButtonProps) => !!props.href, // Only show if href is present
            },
            { key: "padding", type: "text", label: "Padding" },
            { key: "backgroundColor", type: "color", label: "Background" },
            { key: "color", type: "color", label: "Text Color" },
            { key: "borderRadius", type: "text", label: "Border Radius" },
            { key: "fontSize", type: "text", label: "Font Size" },
            { key: "fontWeight", type: "text", label: "Font Weight" },
            { key: "width", type: "text", label: "Width" },
            { key: "height", type: "text", label: "Height" },
            { key: "border", type: "text", label: "Border" },
            { key: "boxShadow", type: "text", label: "Box Shadow" },
            // className will be handled by the ClassNameEditor in SettingsPanel
            // { key: "className", type: "text", label: "Tailwind Classes" },
          ],
        },
      ],
    },
  },
};
