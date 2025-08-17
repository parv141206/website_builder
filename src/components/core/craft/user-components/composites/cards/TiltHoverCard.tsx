"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

export type TiltHoverCardProps = {
  title: string;
  description: string;
  containerProps?: Partial<ContainerProps>;
  titleProps?: Partial<TextProps>;
  descriptionProps?: Partial<TextProps>;
};

export const TiltHoverCard: React.FC<TiltHoverCardProps> & { craft?: any } = ({
  title,
  description,
  containerProps,
  titleProps,
  descriptionProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Container
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      canvas
      className="relative transition-transform duration-500 ease-out hover:scale-105 hover:rotate-1"
    >
      <Element
        is={Container}
        canvas
        id="TiltHoverCard-content"
        padding="20px"
        borderRadius="16px"
        background="linear-gradient(to bottom right, #9333ea, #ec4899, #ef4444)"
        boxShadow="0 10px 25px rgba(0,0,0,0.3)"
        {...containerProps}
      >
        <Element
          is={Text}
          id="TiltHoverCard-title"
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
          id="TiltHoverCard-description"
          text={description}
          as="p"
          fontSize="14px"
          color="rgba(255,255,255,0.9)"
          {...descriptionProps}
        />
      </Element>
    </Container>
  );
};

TiltHoverCard.craft = {
  displayName: "Tilt Hover Card",
  props: {
    title: "Tilt Hover Card",
    description:
      "This card tilts smoothly on hover with a futuristic gradient.",
    containerProps: {},
    titleProps: {},
    descriptionProps: {},
  },
  rules: { canDrag: () => true },
};
