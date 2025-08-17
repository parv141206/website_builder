"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

export type CallToActionProps = {
  heading: string;
  buttonText: string;
  containerProps?: Partial<ContainerProps>;
  headingProps?: Partial<TextProps>;
  buttonProps?: Partial<TextProps>;
};

export const CallToAction: React.FC<CallToActionProps> & { craft?: unknown } = ({
  heading,
  buttonText,
  containerProps,
  headingProps,
  buttonProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Element
      is={Container}
      canvas
      id="CallToAction-wrapper"
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      padding="0"
      backgroundColor="transparent"
      {...containerProps}
    >
      <Element
        is={Container}
        canvas
        id="CallToAction-container"
        padding="60px 20px"
        backgroundColor="#ef4444"
        textAlign="center"
        color="#fff"
        borderRadius="12px"
      >
        <Element
          is={Text}
          id="CallToAction-heading"
          text={heading}
          as="h2"
          fontSize="28px"
          fontWeight="bold"
          margin="0 0 16px 0"
          {...headingProps}
        />
        <Element
          is={Text}
          id="CallToAction-button"
          text={buttonText}
          as="button"
          padding="12px 24px"
          fontSize="16px"
          fontWeight="bold"
          borderRadius="8px"
          backgroundColor="#fff"
          color="#ef4444"
          cursor="pointer"
          {...buttonProps}
        />
      </Element>
    </Element>
  );
};

CallToAction.craft = {
  displayName: "Call To Action",
  props: {
    heading: "Get Started Today!",
    buttonText: "Sign Up",
    containerProps: {},
    headingProps: {},
    buttonProps: {},
  },
  rules: { canDrag: () => true },
};
