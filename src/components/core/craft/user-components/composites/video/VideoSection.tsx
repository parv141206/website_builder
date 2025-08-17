"use client";

import React from "react";
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

export const VideoSection: React.FC<VideoSectionProps> & { craft?: any } = ({
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

  return (
    <div ref={(ref) => connect(drag(ref as HTMLDivElement))}>
      <Element
        is={Container}
        canvas
        id="VideoSection-container"
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
      </Element>
    </div>
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
