"use client";

import React, { useRef, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

export type VideoSectionProps = {
  videoUrl: string;
  title: string;
  description: string;
  containerProps?: Partial<ContainerProps>;
  titleProps?: Partial<TextProps>;
  descriptionProps?: Partial<TextProps>;
};

export const VideoSection: React.FC<VideoSectionProps> & { craft?: unknown } = ({
  videoUrl,
  title,
  description,
  containerProps,
  titleProps,
  descriptionProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Connect drag after mount
  useEffect(() => {
    if (wrapperRef.current) connect(drag(wrapperRef.current));
  }, [connect, drag]);

  return (
    <Container
      ref={wrapperRef}
      canvas
      padding="24px"
      borderRadius="12px"
      textAlign="center"
      {...containerProps}
    >
      <iframe
        src={videoUrl}
        width="100%"
        height="360px"
        style={{ borderRadius: "8px" }}
        allowFullScreen
      />
      <Element
        is={Text}
        id="VideoSection-title"
        text={title}
        as="h3"
        fontWeight="bold"
        fontSize="20px"
        margin="16px 0 8px 0"
        {...titleProps}
      />
      <Element
        is={Text}
        id="VideoSection-description"
        text={description}
        as="p"
        fontSize="14px"
        {...descriptionProps}
      />
    </Container>
  );
};

VideoSection.craft = {
  displayName: "Video Section",
  props: {
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "Our Intro Video",
    description: "Learn more about our services in this video.",
    containerProps: {},
    titleProps: {},
    descriptionProps: {},
  },
  rules: { canDrag: () => true },
};
