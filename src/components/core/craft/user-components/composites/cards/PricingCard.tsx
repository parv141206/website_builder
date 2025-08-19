"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";

export type PricingCardProps = {
  plan: string;
  price: string;
  features: string[];
  containerProps?: Partial<ContainerProps>;
  planProps?: Partial<TextProps>;
  priceProps?: Partial<TextProps>;
  featureProps?: Partial<TextProps>;
};

export const PricingCard: React.FC<PricingCardProps> & { craft?: any } = ({
  plan,
  price,
  features,
  containerProps,
  planProps,
  priceProps,
  featureProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Container
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      canvas
      padding="24px"
      borderRadius="12px"
      boxShadow="0 4px 12px rgba(0,0,0,0.1)"
      textAlign="center"
      {...containerProps}
    >
      <Element
        is={Text}
        id="PricingCard-plan"
        text={plan}
        as="h3"
        fontWeight="bold"
        fontSize="20px"
        margin="0 0 12px 0"
        {...planProps}
      />
      <Element
        is={Text}
        id="PricingCard-price"
        text={price}
        as="p"
        fontSize="24px"
        fontWeight="bold"
        margin="0 0 16px 0"
        {...priceProps}
      />
      {features.map((feature, index) => (
        <Element
          key={index}
          is={Text}
          id={`PricingCard-feature-${index}`}
          text={`• ${feature}`}
          as="p"
          fontSize="14px"
          margin="4px 0"
          {...featureProps}
        />
      ))}
    </Container>
  );
};

PricingCard.craft = {
  displayName: "Pricing Card",
  props: {
    plan: "Basic Plan",
    price: "$19/mo",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    containerProps: {},
    planProps: {},
    priceProps: {},
    featureProps: {},
  },
  rules: {
    canDrag: () => true,
  },
};
