"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";
import { Image, type ImageProps } from "../../primitives/Image";

type SingleTestimonial = {
  quote: string;
  author: string;
  role: string;
  imageSrc: string;
  imageAlt?: string;
  textProps?: Partial<TextProps>;
  imageProps?: Partial<ImageProps>;
};

export type TestimonialSectionProps = {
  heading?: string;
  subheading?: string;
  headingProps?: Partial<TextProps>;
  subheadingProps?: Partial<TextProps>;
  testimonials: SingleTestimonial[];
  containerProps?: Partial<ContainerProps>;
  cardProps?: Partial<ContainerProps>;
  quoteProps?: Partial<TextProps>;
  authorProps?: Partial<TextProps>;
  roleProps?: Partial<TextProps>;
};

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  heading,
  subheading,
  headingProps,
  subheadingProps,
  testimonials,
  containerProps,
  cardProps,
  quoteProps,
  authorProps,
  roleProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Element
      id="TestimonialSection-wrapper"
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
          id="TestimonialSection-heading"
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
          id="TestimonialSection-subheading"
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
        id="TestimonialSection-cards-grid"
        is={Container}
        canvas
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
        gap="24px"
        width="100%"
        maxWidth="1000px"
      >
        {testimonials.map((t, idx) => (
          <Element
            key={idx}
            is={Container}
            id={`TestimonialSection-card-${idx}`}
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
            <Element
              is={Image}
              id={`TestimonialSection-image-${idx}`}
              src={t.imageSrc}
              alt={t.imageAlt || t.author}
              width="90px"
              height="90px"
              borderRadius="50%"
              objectFit="cover"
              border="2px solid var(--theme-accent)"
              marginBottom="16px"
              {...t.imageProps}
            />

            <Element
              is={Text}
              id={`TestimonialSection-quote-${idx}`}
              text={`“${t.quote}”`}
              fontSize="18px"
              fontStyle="italic"
              color="var(--theme-text-body)"
              marginBottom="12px"
              {...quoteProps}
            />

            <Element
              is={Text}
              id={`TestimonialSection-author-${idx}`}
              text={t.author}
              fontSize="16px"
              fontWeight="600"
              color="var(--theme-accent)"
              marginBottom="4px"
              {...authorProps}
            />

            <Element
              is={Text}
              id={`TestimonialSection-role-${idx}`}
              text={t.role}
              fontSize="14px"
              color="var(--theme-text-muted)"
              {...roleProps}
            />
          </Element>
        ))}
      </Element>
    </Element>
  );
};
