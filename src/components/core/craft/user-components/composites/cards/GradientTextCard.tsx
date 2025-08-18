"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";
import { motion } from "motion/react";

export type GradientTextCardProps = {
  title: string;
  text: string;
  containerProps?: Partial<ContainerProps>;
  titleProps?: Partial<TextProps>;
  textProps?: Partial<TextProps>;
};

export const GradientTextCard: React.FC<GradientTextCardProps> & {
  craft?: any;
} = ({ title, text, containerProps, titleProps, textProps }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Container
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      maxWidth="24rem"
      borderRadius="2xl"
      padding="6"
      style={{
        background: "linear-gradient(90deg, #6366f1, #9333ea, #ec4899)",
        color: "white",
      }}
      className="shadow-lg"
      as={motion.div} // <-- enables motion animations on Container
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...containerProps}
    >
      <Element
        is={Container}
        canvas
        id="GradientTextCard-content"
        style={{ backgroundColor: "transparent", padding: 0 }}
      >
        <Element
          is={Text}
          id="GradientTextCard-title"
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
          id="GradientTextCard-text"
          text={text}
          as="p"
          fontSize="14px"
          color="white"
          {...textProps}
        />
      </Element>
    </Container>
  );
};

GradientTextCard.craft = {
  displayName: "Gradient Text Card",
  props: {
    title: "Gradient Text Card",
    text: "This card has a gradient background with smooth animations.",
    containerProps: {},
    titleProps: {},
    textProps: {},
  },
  rules: { canDrag: () => true },
};
