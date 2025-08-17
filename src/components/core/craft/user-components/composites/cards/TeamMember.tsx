"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";
import { Image, type ImageProps } from "../../primitives/Image";

export type TeamMemberProps = {
  name: string;
  role: string;
  imageProps?: Partial<ImageProps>;
  containerProps?: Partial<ContainerProps>;
  nameProps?: Partial<TextProps>;
  roleProps?: Partial<TextProps>;
};

export const TeamMember: React.FC<TeamMemberProps> & { craft?: any } = ({
  name,
  role,
  imageProps,
  containerProps,
  nameProps,
  roleProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref!))}>
      <Element
        is={Container}
        canvas
        id="TeamMember-container"
        padding="16px"
        borderRadius="12px"
        boxShadow="0 4px 6px rgba(0,0,0,0.1)"
        textAlign="center"
        {...containerProps}
      >
        <Element
          is={Image}
          id="TeamMember-image"
          src={imageProps?.src ?? "https://via.placeholder.com/150"}
          alt={imageProps?.alt ?? "Team Member"}
          width="120px"
          height="120px"
          borderRadius="50%"
          marginBottom="12px"
          {...imageProps}
        />
        <Element
          is={Text}
          id="TeamMember-name"
          text={name}
          as="h4"
          fontWeight="bold"
          fontSize="18px"
          margin="0 0 4px 0"
          {...nameProps}
        />
        <Element
          is={Text}
          id="TeamMember-role"
          text={role}
          as="p"
          fontSize="14px"
          color="#6b7280"
          {...roleProps}
        />
      </Element>
    </div>
  );
};

TeamMember.craft = {
  displayName: "Team Member",
  props: {
    name: "Jane Doe",
    role: "CEO",
    imageProps: { src: "https://via.placeholder.com/150", alt: "Team Member" },
    containerProps: {},
    nameProps: {},
    roleProps: {},
  },
  rules: { canDrag: () => true },
};
