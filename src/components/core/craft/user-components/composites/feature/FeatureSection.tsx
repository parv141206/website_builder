"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";

type SingleFeature = {
  title: string;
  description: string;
  icon?: string;
  titleProps?: Partial<TextProps>;
  descriptionProps?: Partial<TextProps>;
};

export type FeaturesSectionProps = {
  heading?: string;
  subheading?: string;
  headingProps?: Partial<TextProps>;
  subheadingProps?: Partial<TextProps>;
  features: SingleFeature[];
  containerProps?: Partial<ContainerProps>;
  cardProps?: Partial<ContainerProps>;
};

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  heading,
  subheading,
  headingProps,
  subheadingProps,
  features,
  containerProps,
  cardProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  
  const extendedFeatures = [...features];
  if (features.length < 6) {
    extendedFeatures.push(
      {
        title: "Seamless Integration",
        description: "Easily connects with your favorite tools and platforms.",
        icon: "🔗",
      },
      {
        title: "24/7 Support",
        description: "Our team is always ready to help you anytime, anywhere.",
        icon: "🛠️",
      },
    );
  }

  return (
    <Element
      id="FeaturesSection-wrapper"
      is={Container}
      canvas
      ref={(ref) => connect(drag(ref))}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="32px"
      padding="64px"
      borderRadius="24px"
      background="rgba(255, 255, 255, 0.12)"
      border="1px solid rgba(255, 255, 255, 0.25)"
      backdropFilter="blur(18px) saturate(180%)"
      boxShadow="0 8px 24px rgba(0,0,0,0.15)"
      {...containerProps}
    >
      {heading && (
        <Element
          is={Text}
          id="FeaturesSection-heading"
          text={heading}
          fontSize="34px"
          fontWeight="700"
          color="var(--theme-text-heading)"
          textAlign="center"
          letterSpacing="1px"
          {...headingProps}
        />
      )}

      {subheading && (
        <Element
          is={Text}
          id="FeaturesSection-subheading"
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
        id="FeaturesSection-cards-grid"
        is={Container}
        canvas
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(260px, 1fr))"
        gap="28px"
        width="100%"
        maxWidth="1100px"
      >
        {extendedFeatures.map((f, idx) => (
          <Element
            key={idx}
            is={Container}
            id={`FeaturesSection-card-${idx}`}
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
            {f.icon && (
              <Element
                is={Text}
                id={`FeaturesSection-icon-${idx}`}
                text={f.icon}
                fontSize="40px"
                marginBottom="16px"
                color="var(--theme-accent)"
              />
            )}

            <Element
              is={Text}
              id={`FeaturesSection-title-${idx}`}
              text={f.title}
              fontSize="20px"
              fontWeight="600"
              color="var(--theme-text-heading)"
              marginBottom="10px"
              {...f.titleProps}
            />

            <Element
              is={Text}
              id={`FeaturesSection-description-${idx}`}
              text={f.description}
              fontSize="15px"
              color="var(--theme-text-body)"
              {...f.descriptionProps}
            />
          </Element>
        ))}
      </Element>
    </Element>
  );
};
