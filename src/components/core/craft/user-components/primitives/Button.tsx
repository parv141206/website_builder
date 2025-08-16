"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { useTheme } from "~/themes";
import { Container, type ContainerProps } from "./Container";
import { Text, type TextProps } from "./Text";

// ⭐ PROPS DEFINITION
// It combines Container and Text props for full control.
export type ButtonProps = {
  text: string;
  containerProps?: Partial<ContainerProps>;
  textProps?: Partial<TextProps>;
};

export const Button: React.FC<ButtonProps> & { craft?: any } = ({
  text,
  containerProps,
  textProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const theme = useTheme();

  return (
    // We use an <Element> of a Container, but set `isCanvas={false}`
    // so users can't drop other components inside the button.
    <Element
      is={Container}
      id="button-container"
      // This ref makes the entire button draggable as one unit.
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      // Default styles that use the theme
      as="button"
      padding="12px 24px"
      background={theme.colors.primary}
      color={theme.colors.text.onPrimary || "#ffffff"}
      borderRadius="8px"
      // User overrides are spread last
      {...containerProps}
      // Ensure it's not a canvas
      isCanvas={false}
    >
      {/* The text inside is also an Element, so its props can be edited.
          But we can choose not to expose them in the settings if we want. */}
      <Element
        is={Text}
        id="button-text"
        text={text}
        fontSize="16px"
        fontWeight="bold"
        textAlign="center"
        {...textProps}
      />
    </Element>
  );
};

// ⭐ CRAFT.JS CONFIGURATION
Button.craft = {
  displayName: "Button",
  props: {
    text: "Click Me",
    containerProps: {},
    textProps: {},
  } satisfies ButtonProps,
  rules: {
    canDrag: () => true,
    // We explicitly say nothing can be moved into a button.
    canMoveIn: () => false,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [{ key: "text", type: "text", label: "Button Text" }],
        },
        // We use the "props tunneling" pattern we perfected for Card1.
        {
          label: "Button Styles",
          key: "containerProps",
          type: "group",
          fields: [
            { key: "background", type: "color", label: "Background" },
            { key: "padding", type: "text", label: "Padding" },
            { key: "borderRadius", type: "text", label: "Radius" },
            { key: "boxShadow", type: "text", label: "Shadow" },
          ],
        },
        {
          label: "Text Styles",
          key: "textProps",
          type: "group",
          fields: [
            { key: "color", type: "color", label: "Text Color" },
            { key: "fontSize", type: "text", label: "Font Size" },
            { key: "fontWeight", type: "text", label: "Font Weight" },
          ],
        },
      ],
    },
  },
};
