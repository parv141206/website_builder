"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";

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
    <Container
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      className="animate-gradient-x relative rounded-2xl p-[2px]"
      background="linear-gradient(to right, #06b6d4, #d946ef, #06b6d4)"
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
    </Container>
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
};
