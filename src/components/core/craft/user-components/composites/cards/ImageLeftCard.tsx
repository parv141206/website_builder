"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Animated } from "../../primitives/Animated";
import { Image, type ImageProps } from "../../primitives/Image";
import { Text, type TextProps } from "../../primitives/Typography/Text";
import { Container } from "../../primitives/Container";

export type ImageLeftCardProps = {
  imageProps?: Partial<ImageProps>;
  titleProps?: Partial<TextProps>;
  textProps?: Partial<TextProps>;
};

export const ImageLeftCard: React.FC<ImageLeftCardProps> & { craft?: any } = ({
  imageProps,
  titleProps,
  textProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Element flexDirection="row" id="ImageLeftCard" is={Container}>
      <Element
        is={Image}
        id="ImageLeftCard-image"
        src={imageProps?.src || "https://picsum.photos/200/300"}
        alt={imageProps?.alt || "Image Left Card"}
        className="w-1/3 object-cover"
        {...imageProps}
      />
      <Element flexDirection="column" id="ImageLeftCard" is={Container}>
        <Element
          is={Text}
          id="ImageLeftCard-title"
          text={titleProps?.text || "Image Left Card"}
          as="h3"
          fontSize="18px"
          fontWeight="bold"
          {...titleProps}
        />
        <Element
          is={Text}
          id="ImageLeftCard-text"
          text={textProps?.text || "This card has an image on the left."}
          as="p"
          fontSize="14px"
          margin="4px 0 0 0"
          {...textProps}
        />
      </Element>
    </Element>
  );
};

ImageLeftCard.craft = {
  displayName: "Image Left Card",
  props: {
    imageProps: {
      src: "https://picsum.photos/200/300",
      alt: "Image Left Card",
    },
    titleProps: { text: "Image Left Card" },
    textProps: { text: "This card has an image on the left." },
  },
  rules: { canDrag: () => true },
};
