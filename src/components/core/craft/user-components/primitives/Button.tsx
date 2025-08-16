"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { useTheme } from "~/themes";
import { Container, type ContainerProps } from "./Container";
import { Text, type TextProps } from "./Text";

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
    <Element
      is={Container}
      id="button-container"
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      as="button"
      padding="12px 24px"
      background={theme.colors.primary}
      color={theme.colors.text.onPrimary || "#ffffff"}
      borderRadius="8px"
      {...containerProps}
      isCanvas={false}
    >
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

Button.craft = {
  displayName: "Button",
  props: {
    text: "Click Me",
    containerProps: {},
    textProps: {},
  } satisfies ButtonProps,
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [{ key: "text", type: "text", label: "Button Text" }],
        },
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
