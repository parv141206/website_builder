"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";
import { Image, type ImageProps } from "../../primitives/Image";

type SingleMenuItem = {
  name: string;
  description?: string;
  price?: string;
  imageSrc?: string;
  imageAlt?: string;
  textProps?: Partial<TextProps>;
  imageProps?: Partial<ImageProps>;
};

export type MenuSectionProps = {
  heading?: string;
  subheading?: string;
  headingProps?: Partial<TextProps>;
  subheadingProps?: Partial<TextProps>;
  items: SingleMenuItem[];
  containerProps?: Partial<ContainerProps>;
  cardProps?: Partial<ContainerProps>;
  nameProps?: Partial<TextProps>;
  descriptionProps?: Partial<TextProps>;
  priceProps?: Partial<TextProps>;
};

export const MenuSection: React.FC<MenuSectionProps> = ({
  heading,
  subheading,
  headingProps,
  subheadingProps,
  items,
  containerProps,
  cardProps,
  nameProps,
  descriptionProps,
  priceProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Element
      id="MenuSection-wrapper"
      is={Container}
      canvas
      ref={(ref) => connect(drag(ref))}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="32px"
      padding="64px"
      background="rgba(255, 255, 255, 0.12)" 
      border="1px solid rgba(255, 255, 255, 0.25)" 
      backdropFilter="blur(18px) saturate(180%)" 
      borderRadius="24px"
      boxShadow="0 8px 24px rgba(0,0,0,0.15)" 
      {...containerProps}
    >
      {heading && (
        <Element
          is={Text}
          id="MenuSection-heading"
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
          is={Text}
          id="MenuSection-subheading"
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
        id="MenuSection-cards-grid"
        is={Container}
        canvas
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
        gap="24px"
        width="100%"
        maxWidth="1000px"
      >
        {items.map((item, idx) => (
          <Element
            key={idx}
            is={Container}
            id={`MenuSection-card-${idx}`}
            canvas
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            padding="24px"
            borderRadius="20px"
            background="rgba(255, 255, 255, 0.15)" 
            backdropFilter="blur(12px) saturate(160%)"
            border="1px solid rgba(255,255,255,0.25)"
            boxShadow="0 4px 12px rgba(0,0,0,0.1)"
            transition="transform 0.3s ease, box-shadow 0.3s ease"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              background: "rgba(255, 255, 255, 0.2)", 
            }}
            {...cardProps}
          >
            {item.imageSrc && (
              <Element
                is={Image}
                id={`MenuSection-image-${idx}`}
                src={item.imageSrc}
                alt={item.imageAlt || item.name}
                width="100px"
                height="100px"
                borderRadius="16px"
                objectFit="cover"
                marginBottom="16px"
                {...item.imageProps}
              />
            )}

            <Element
              is={Text}
              id={`MenuSection-name-${idx}`}
              text={item.name}
              fontSize="18px"
              fontWeight="600"
              color="var(--theme-accent)"
              marginBottom="8px"
              {...nameProps}
            />

            {item.description && (
              <Element
                is={Text}
                id={`MenuSection-description-${idx}`}
                text={item.description}
                fontSize="14px"
                color="var(--theme-text-body)"
                marginBottom="8px"
                {...descriptionProps}
              />
            )}

            {item.price && (
              <Element
                is={Text}
                id={`MenuSection-price-${idx}`}
                text={item.price}
                fontSize="16px"
                fontWeight="700"
                color="var(--theme-accent)"
                {...priceProps}
              />
            )}
          </Element>
        ))}
      </Element>
    </Element>
  );
};
