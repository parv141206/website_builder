"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Animated } from "../../primitives/Animated";
import { Image, type ImageProps } from "../../primitives/Image";
import { Text, type TextProps } from "../../primitives/Text";

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
    <Animated
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      className="flex max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Element
        is={Image}
        id="ImageLeftCard-image"
        src={imageProps?.src || "https://via.placeholder.com/150"}
        alt={imageProps?.alt || "Image Left Card"}
        className="w-1/3 object-cover"
        {...imageProps}
      />
      <div className="flex-1 p-4">
        <Element
          is={Text}
          id="ImageLeftCard-title"
          text={titleProps?.text || "Image Left Card"}
          as="h3"
          fontSize="18px"
          fontWeight="bold"
          color="#111827"
          {...titleProps}
        />
        <Element
          is={Text}
          id="ImageLeftCard-text"
          text={textProps?.text || "This card has an image on the left."}
          as="p"
          fontSize="14px"
          color="#4b5563"
          margin="4px 0 0 0"
          {...textProps}
        />
      </div>
    </Animated>
  );
};

ImageLeftCard.craft = {
  displayName: "Image Left Card",
  props: {
    imageProps: {
      src: "https://via.placeholder.com/150",
      alt: "Image Left Card",
    },
    titleProps: { text: "Image Left Card" },
    textProps: { text: "This card has an image on the left." },
  },
  rules: { canDrag: () => true },
};
