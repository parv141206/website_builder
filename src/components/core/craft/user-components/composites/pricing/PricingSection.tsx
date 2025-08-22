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
      background="rgba(255, 255, 255, 0.12)"
      border="1px solid rgba(255,255,255,0.25)"
      backdropFilter="blur(18px) saturate(180%)"
      borderRadius="24px"
      boxShadow="0 8px 24px rgba(0,0,0,0.15)"
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
            background="rgba(255, 255, 255, 0.15)"
            border="1px solid rgba(255,255,255,0.25)"
            backdropFilter="blur(14px) saturate(160%)"
            boxShadow="0 4px 16px rgba(0,0,0,0.15)"
            transition="transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease"
            _hover={{
              transform: "translateY(-6px) scale(1.02)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              background: "rgba(255,255,255,0.25)",
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
                is={Container}
                as="a"
                href="#"
                padding="12px 24px"
                borderRadius="12px"
                background="rgba(255,255,255,0.15)"
                backdropFilter="blur(10px) saturate(160%)"
                border="1px solid rgba(255,255,255,0.25)"
                cursor="pointer"
                display="flex"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 2px 10px rgba(0,0,0,0.15)"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-2px)",
                  background: "rgba(255,255,255,0.25)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                }}
                {...plan.buttonProps}
              >
                <Text
                  text={plan.buttonText}
                  fontSize="14px"
                  fontWeight="600"
                  color="var(--theme-accent)"
                />
              </Element>
            )}
          </Element>
        ))}
      </Element>
    </Element>
  );
};
