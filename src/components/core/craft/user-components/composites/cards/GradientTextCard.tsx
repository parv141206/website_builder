"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";
import { motion } from "framer-motion";

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
    <motion.div
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      className="max-w-sm rounded-2xl p-6 shadow-lg"
      style={{
        background: "linear-gradient(90deg, #6366f1, #9333ea, #ec4899)",
        color: "white",
      }}
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Element
        is={Container}
        canvas
        id="GradientTextCard-content"
        {...containerProps}
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
    </motion.div>
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
  related: {
    settingsSchema: [
      {
        label: "Content",
        fields: [
          { key: "title", type: "text", label: "Title" },
          { key: "text", type: "textarea", label: "Text" },
        ],
      },
    ],
  },
};
