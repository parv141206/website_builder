"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";

export type FuturisticFooterProps = {
  containerProps?: Partial<ContainerProps>;
};

export const FuturisticFooter: React.FC<FuturisticFooterProps> = ({
  containerProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Element
      id="FuturisticFooter-wrapper"
      is={Container}
      canvas
      ref={(ref: any) => connect(drag(ref))}
      background="var(--theme-background-primary)" // theme-aware background
      color="var(--theme-text-body)"
      padding="24px"
      borderRadius="16px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="16px"
      {...containerProps}
    >
      {/* Heading with theme-based color */}
      <Element
        id="FuturisticFooter-heading"
        is={Text}
        text="🚀 Futuristic Footer"
        fontSize="20px"
        fontWeight="700"
        color="var(--theme-accent)" // dynamic heading color
      />

      {/* Links row */}
      <Element
        id="FuturisticFooter-links-row"
        is={Container}
        canvas
        display="flex"
        flexDirection="row"
        gap="32px"
        justifyContent="center"
      >
        {["Home", "About", "Services", "Contact"].map((link, idx) => (
          <Element
            key={idx}
            id={`FuturisticFooter-link-${idx}`}
            is={Text}
            text={link}
            color="var(--theme-text-muted)" // default link color
            fontSize="14px"
            hoverColor="var(--theme-accent)" // hover color from theme
            cursor="pointer"
          />
        ))}
      </Element>

      {/* Copyright */}
      <Element
        id="FuturisticFooter-copyright"
        is={Text}
        text="© 2025 Futuristic Inc. All rights reserved."
        color="var(--theme-text-muted)" // theme-aware muted text
        fontSize="12px"
      />
    </Element>
  );
};
