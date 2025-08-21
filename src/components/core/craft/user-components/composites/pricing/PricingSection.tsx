"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";

type SinglePricing = {
  title: string;
  price: string;
  features: string[];
  buttonText?: string;
  titleProps?: Partial<TextProps>;
  priceProps?: Partial<TextProps>;
  featureProps?: Partial<TextProps>;
  buttonProps?: Partial<TextProps>;
};

export type PricingSectionProps = {
  heading?: string;
  subheading?: string;
  headingProps?: Partial<TextProps>;
  subheadingProps?: Partial<TextProps>;
  plans: SinglePricing[];
  containerProps?: Partial<ContainerProps>;
  cardProps?: Partial<ContainerProps>;
};

export const PricingSection: React.FC<PricingSectionProps> = ({
  heading,
  subheading,
  headingProps,
  subheadingProps,
  plans,
  containerProps,
  cardProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Element
      id="PricingSection-wrapper"
      is={Container}
      canvas
      ref={(ref) => connect(drag(ref))}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="32px"
      padding="64px"
      background="rgba(25,25,25,0.8)"
      border="1px solid rgba(255,255,255,0.1)"
      backdropFilter="blur(14px)"
      borderRadius="24px"
      boxShadow="0 6px 40px rgba(0,0,0,0.5)"
      {...containerProps}
    >
      {heading && (
        <Element
          id="PricingSection-heading"
          is={Text}
          text={heading}
          fontSize="32px"
          fontWeight="700"
          color="var(--theme-text-heading)"
          textAlign="center"
          letterSpacing="1px"
          {...headingProps}
        />
      )}

      {subheading && (
        <Element
          id="PricingSection-subheading"
          is={Text}
          text={subheading}
          fontSize="18px"
          fontWeight="400"
          color="var(--theme-text-body)"
          textAlign="center"
          maxWidth="700px"
          {...subheadingProps}
        />
      )}

      <Element
        id="PricingSection-cards-grid"
        is={Container}
        canvas
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(260px, 1fr))"
        gap="28px"
        width="100%"
        maxWidth="1100px"
      >
        {plans.map((plan, idx) => (
          <Element
            key={idx}
            id={`PricingSection-card-${idx}`}
            is={Container}
            canvas
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            padding="28px"
            borderRadius="18px"
            background="rgba(35,35,35,0.85)"
            border="1px solid rgba(255,255,255,0.1)"
            backdropFilter="blur(12px)"
            boxShadow="0 4px 20px rgba(0,0,0,0.4)"
            transition="transform 0.3s ease, box-shadow 0.3s ease"
            _hover={{
              transform: "translateY(-8px) scale(1.03)",
              boxShadow: "0 0 35px rgba(0,0,0,0.5)",
            }}
            {...cardProps}
          >
            {/* Plan Title */}
            <Element
              id={`PricingSection-title-${idx}`}
              is={Text}
              text={plan.title}
              fontSize="20px"
              fontWeight="600"
              color="var(--theme-text-heading)"
              marginBottom="10px"
              {...plan.titleProps}
            />

            {/* Plan Price */}
            <Element
              id={`PricingSection-price-${idx}`}
              is={Text}
              text={plan.price}
              fontSize="28px"
              fontWeight="700"
              color="var(--theme-accent)"
              marginBottom="16px"
              {...plan.priceProps}
            />

            {/* Features List */}
            <Element
              id={`PricingSection-features-${idx}`}
              is={Container}
              canvas
              display="flex"
              flexDirection="column"
              gap="8px"
              marginBottom="16px"
            >
              {plan.features.map((feature, fIdx) => (
                <Element
                  key={fIdx}
                  id={`PricingSection-feature-${idx}-${fIdx}`}
                  is={Text}
                  text={`• ${feature}`}
                  fontSize="15px"
                  color="var(--theme-text-body)"
                  {...plan.featureProps}
                />
              ))}
            </Element>

            {/* Button */}
            {plan.buttonText && (
              <Element
                id={`PricingSection-button-${idx}`}
                is={Text}
                text={plan.buttonText}
                fontSize="14px"
                fontWeight="600"
                color="var(--theme-background-primary)"
                background="var(--theme-accent)"
                padding="10px 20px"
                borderRadius="12px"
                cursor="pointer"
                textAlign="center"
                {...plan.buttonProps}
              />
            )}
          </Element>
        ))}
      </Element>
    </Element>
  );
};
