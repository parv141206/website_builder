"use client";

import React, { useRef, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";
import { Image, type ImageProps } from "../../primitives/Image";

export type ImageTopCardProps = {
  imageProps?: Partial<ImageProps>;
  titleProps?: Partial<TextProps>;
  textProps?: Partial<TextProps>;
  containerProps?: Partial<ContainerProps>;
};

export const ImageTopCard: React.FC<ImageTopCardProps> & { craft?: unknown } = ({
  imageProps,
  titleProps,
  textProps,
  containerProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) connect(drag(wrapperRef.current));
  }, [connect, drag]);

  return (
    <Container
      ref={wrapperRef}
      canvas
      border="1px solid #e5e7eb"
      borderRadius="16px"
      boxShadow="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
      overflow="hidden"
      backgroundColor="white"
      maxWidth="400px"
      {...containerProps}
    >
      <Element
        is={Image}
        id="ImageTopCard-image"
        src="https://via.placeholder.com/400x200"
        alt="Image Top Card"
        width="100%"
        height="200px"
        objectFit="cover"
        {...imageProps}
      />
      <Container padding="16px">
        <Element
          is={Text}
          id="ImageTopCard-title"
          text="Image Top Card"
          as="h3"
          fontSize="18px"
          fontWeight="bold"
          margin="0 0 8px 0"
          {...titleProps}
        />
        <Element
          is={Text}
          id="ImageTopCard-text"
          text="This is a card with an image on top."
          as="p"
          fontSize="14px"
          color="#4b5563"
          {...textProps}
        />
      </Container>
    </Container>
  );
};

ImageTopCard.craft = {
  displayName: "Image Top Card",
  props: {
    imageProps: {
      src: "https://via.placeholder.com/400x200",
      alt: "Image Top Card",
      width: "100%",
      height: "200px",
      objectFit: "cover",
    },
    titleProps: { text: "Image Top Card" },
    textProps: { text: "This is a card with an image on top." },
    containerProps: {},
  },
  rules: { canDrag: () => true },
};
