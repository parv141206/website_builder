"use client";

import React, { useRef, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

export type GlassCardProps = {
  titleProps?: Partial<TextProps>;
  textProps?: Partial<TextProps>;
  containerProps?: Partial<ContainerProps>;
};

export const GlassCard: React.FC<GlassCardProps> & { craft?: any } = ({
  titleProps,
  textProps,
  containerProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) connect(drag(wrapperRef.current));
  }, [connect, drag]);

  return (
    <div ref={wrapperRef}>
      <Element
        is={Container}
        canvas
        id="GlassCard-container"
        padding="24px"
        borderRadius="16px"
        color="white"
        {...containerProps}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "16px",
          color: "white",
          maxWidth: "400px",
          overflow: "hidden",
        }}
      >
        <Element
          is={Text}
          id="GlassCard-title"
          text="Glass Card"
          as="h3"
          fontSize="20px"
          fontWeight="bold"
          margin="0 0 8px 0"
          {...titleProps}
        />
        <Element
          is={Text}
          id="GlassCard-text"
          text="This card has a sleek frosted glass effect."
          as="p"
          fontSize="14px"
          opacity="0.8"
          {...textProps}
        />
      </Element>
    </div>
  );
};

GlassCard.craft = {
  displayName: "Glass Card",
  props: {
    titleProps: { text: "Glass Card" },
    textProps: { text: "This card has a sleek frosted glass effect." },
    containerProps: {},
  },
  rules: { canDrag: () => true },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [
            { key: "titleProps.text", type: "text", label: "Title" },
            { key: "textProps.text", type: "textarea", label: "Text" },
          ],
        },
      ],
    },
  },
};
