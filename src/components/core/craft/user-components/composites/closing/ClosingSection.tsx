"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";
import { Image, type ImageProps } from "../../primitives/Image";

export type ClosingSectionProps = {
  heading?: string;
  subheading?: string;
  backgroundImageSrc?: string;
  headingProps?: Partial<TextProps>;
  subheadingProps?: Partial<TextProps>;
  containerProps?: Partial<ContainerProps>;
  buttonText?: string;
  buttonLink?: string;
  buttonProps?: Partial<ContainerProps & { textProps?: Partial<TextProps> }>;
};

export const ClosingSection: React.FC<ClosingSectionProps> = ({
  heading,
  subheading,
  backgroundImageSrc,
  headingProps,
  subheadingProps,
  containerProps,
  buttonText,
  buttonLink,
  buttonProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Element
      id="ClosingSection-wrapper"
      is={Container}
      canvas
      ref={(ref) => connect(drag(ref))}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="24px"
      padding="80px 32px"
      borderRadius="24px"
      background={
        backgroundImageSrc
          ? `linear-gradient(rgba(255,255,255,0.12), rgba(255,255,255,0.12)), url(${backgroundImageSrc}) center/cover no-repeat`
          : "rgba(255, 255, 255, 0.12)"
      }
      border="1px solid rgba(255,255,255,0.25)"
      backdropFilter="blur(18px) saturate(180%)"
      boxShadow="0 8px 24px rgba(0,0,0,0.15)"
      transition="all 0.3s ease"
      {...containerProps}
    >
      {heading && (
        <Element
          is={Text}
          id="ClosingSection-heading"
          text={heading}
          fontSize="36px"
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
          id="ClosingSection-subheading"
          text={subheading}
          fontSize="18px"
          fontWeight="400"
          color="var(--theme-text-body)"
          textAlign="center"
          maxWidth="700px"
          {...subheadingProps}
        />
      )}

      {buttonText && (
        <Element
          is={Container}
          id="ClosingSection-button"
          canvas
          as="a"
          href={buttonLink || "#"}
          padding="14px 32px"
          borderRadius="14px"
          background="rgba(255,255,255,0.15)"
          backdropFilter="blur(12px) saturate(160%)"
          border="1px solid rgba(255,255,255,0.25)"
          cursor="pointer"
          display="flex"
          justifyContent="center"
          alignItems="center"
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          transition="transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            background: "rgba(255,255,255,0.25)",
          }}
          {...buttonProps}
        >
          {buttonProps?.textProps ? (
            <Element
              is={Text}
              id="ClosingSection-button-text"
              text={buttonText}
              fontSize="16px"
              fontWeight="700"
              color="var(--theme-accent)"
              {...buttonProps.textProps}
            />
          ) : (
            <Text
              text={buttonText}
              fontSize="16px"
              fontWeight="700"
              color="var(--theme-accent)"
            />
          )}
        </Element>
      )}
    </Element>
  );
};
