"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Image, type ImageProps } from "../../primitives/Image";

export type ImageGalleryProps = {
  images: Partial<ImageProps>[]; // Optional props allowed
  columns?: number;
  gap?: string;
  containerProps?: Partial<ContainerProps>;
};

export const ImageGallery: React.FC<ImageGalleryProps> & { craft?: any } = ({
  images,
  columns = 3,
  gap = "12px",
  containerProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Container
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      canvas
      display="grid"
      gridTemplateColumns={`repeat(${columns}, 1fr)`}
      gap={gap}
      {...containerProps}
    >
      {images.map((imgProps, idx) => (
        <Element
          key={idx}
          is={Image}
          id={`ImageGallery-image-${idx}`}
          src={imgProps.src ?? "https://via.placeholder.com/300x200"} // default src
          alt={imgProps.alt ?? `Image ${idx + 1}`} // default alt
          width={imgProps.width}
          height={imgProps.height}
          objectFit={imgProps.objectFit}
          {...imgProps} // spread other optional props
        />
      ))}
    </Container>
  );
};

ImageGallery.craft = {
  displayName: "Image Gallery",
  props: {
    images: [
      { src: "https://via.placeholder.com/300x200", alt: "Image 1" },
      { src: "https://via.placeholder.com/300x200", alt: "Image 2" },
      { src: "https://via.placeholder.com/300x200", alt: "Image 3" },
    ],
    columns: 3,
    gap: "12px",
    containerProps: {},
  },
  rules: { canDrag: () => true },
};
