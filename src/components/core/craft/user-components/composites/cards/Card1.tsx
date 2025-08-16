"use client";

import React from "react"; // No longer need useMemo, useRef, useEffect
import { useNode, Element } from "@craftjs/core";
// Remove motion/react for now to simplify; we can add it back later.
// import { motion } from "motion/react";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

export type Card1Props = {
  title: string;
  description: string;
  // animationIn: "none" | "fadeIn" | "slideInLeft";
  // animationHover: "none" | "grow" | "lift";
  // animationDuration: number;

  containerProps?: Partial<ContainerProps>;
  titleProps?: Partial<TextProps>;
  descriptionProps?: Partial<TextProps>;
};

export const Card1: React.FC<Card1Props> & {
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
        id="Card1-content"
        padding="16px"
        borderRadius="8px"
        boxShadow="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
        {...containerProps}
      >
        <Element
          is={Text}
          id="Card1-title"
          text={title}
          as="h3"
          fontSize="20px"
          fontWeight="bold"
          margin="0 0 8px 0"
          {...titleProps}
        />
        <Element
          is={Text}
          id="Card1-description"
          text={description}
          as="p"
          fontSize="14px"
          {...descriptionProps}
        />
      </Element>
    </div>
  );
};

Card1.craft = {
  displayName: "Card 1",
  props: {
    title: "Card Title",
    description: "This is the card description. Edit it here.",
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
