"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

export type NeonBorderCardProps = {
  title: string;
  description: string;
  containerProps?: Partial<ContainerProps>;
  titleProps?: Partial<TextProps>;
  descriptionProps?: Partial<TextProps>;
};

export const NeonBorderCard: React.FC<NeonBorderCardProps> & {
  craft?: any;
} = ({ title, description, containerProps, titleProps, descriptionProps }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      className="animate-gradient-x relative rounded-2xl bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 p-[2px]"
    >
      <Element
        is={Container}
        canvas
        id="NeonBorderCard-content"
        padding="20px"
        borderRadius="16px"
        background="black"
        {...containerProps}
      >
        <Element
          is={Text}
          id="NeonBorderCard-title"
          text={title}
          as="h3"
          fontSize="20px"
          fontWeight="bold"
          color="white"
          margin="0 0 8px 0"
          {...titleProps}
        />
        <Element
          is={Text}
          id="NeonBorderCard-description"
          text={description}
          as="p"
          fontSize="14px"
          color="rgba(255,255,255,0.8)"
          {...descriptionProps}
        />
      </Element>
    </div>
  );
};

NeonBorderCard.craft = {
  displayName: "Neon Border Card",
  props: {
    title: "Neon Glow Title",
    description: "This card has a smooth futuristic neon border.",
    containerProps: {},
    titleProps: {},
    descriptionProps: {},
  },
  rules: { canDrag: () => true },
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
