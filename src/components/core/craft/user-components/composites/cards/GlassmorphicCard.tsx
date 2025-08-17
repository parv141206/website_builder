"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

export type GlassmorphicCardProps = {
  title: string;
  description: string;

  containerProps?: Partial<ContainerProps>;
  titleProps?: Partial<TextProps>;
  descriptionProps?: Partial<TextProps>;
};

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> & {
  craft?: any;
} = ({ title, description, containerProps, titleProps, descriptionProps }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref as HTMLDivElement))}>
      <Element
        is={Container}
        canvas
        id="GlassmorphicCard-content"
        padding="16px"
        borderRadius="16px"
        background="rgba(255,255,255,0.1)"
        backdropFilter="blur(12px)"
        border="1px solid rgba(255,255,255,0.2)"
        boxShadow="0 8px 32px rgba(31, 38, 135, 0.37)"
        color="white"
        {...containerProps}
      >
        <Element
          is={Text}
          id="GlassmorphicCard-title"
          text={title}
          as="h3"
          fontSize="20px"
          fontWeight="bold"
          margin="0 0 8px 0"
          {...titleProps}
        />
        <Element
          is={Text}
          id="GlassmorphicCard-description"
          text={description}
          as="p"
          fontSize="14px"
          {...descriptionProps}
        />
      </Element>
    </div>
  );
};

GlassmorphicCard.craft = {
  displayName: "Glassmorphic Card",
  props: {
    title: "Futuristic Card",
    description: "Glassmorphism with blur and glow effect",
    containerProps: {},
    titleProps: {},
    descriptionProps: {},
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [
            { key: "title", type: "text", label: "Title" },
            { key: "description", type: "textarea", label: "Description" },
          ],
        },
      ],
    },
  },
};
