"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

export type HeroBannerProps = {
  heading: string;
  subheading: string;
  containerProps?: Partial<ContainerProps>;
  headingProps?: Partial<TextProps>;
  subheadingProps?: Partial<TextProps>;
};

export const HeroBanner: React.FC<HeroBannerProps> & { craft?: any } = ({
  heading,
  subheading,
  containerProps,
  headingProps,
  subheadingProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div ref={(ref) => connect(drag(ref!))}>
      <Element
        is={Container}
        canvas
        id="HeroBanner-container"
        padding="80px 20px"
        backgroundColor="#1e40af"
        color="#fff"
        textAlign="center"
        {...containerProps}
      >
        <Element
          is={Text}
          id="HeroBanner-heading"
          text={heading}
          as="h1"
          fontSize="48px"
          fontWeight="bold"
          margin="0 0 16px 0"
          {...headingProps}
        />
        <Element
          is={Text}
          id="HeroBanner-subheading"
          text={subheading}
          as="p"
          fontSize="20px"
          {...subheadingProps}
        />
      </Element>
    </div>
  );
};

HeroBanner.craft = {
  displayName: "Hero Banner",
  props: {
    heading: "Welcome to Our Website",
    subheading: "We build awesome experiences.",
    containerProps: {},
    headingProps: {},
    subheadingProps: {},
  },
  rules: { canDrag: () => true },
};
