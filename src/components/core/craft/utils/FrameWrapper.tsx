"use client";

import React, { useEffect } from "react";
import { useEditor, Element } from "@craftjs/core";
import { useTheme } from "~/themes";
import { DeviceFrame } from "./DeviceFrame";
import { COMPONENT_RESOLVER } from "../user-components/componentResolver";

const { Container, Text } = COMPONENT_RESOLVER;

export const FrameWrapper = ({ savedJson }: { savedJson: string | null }) => {
  const theme = useTheme();

  return (
    <DeviceFrame json={savedJson}>
      <Element
        is={Container}
        canvas
        id="ROOT"
        padding="24px"
        background={theme.colors.background.secondary}
        minHeight="100%"
      >
        <Text
          text="Welcome to your new page!"
          as="h1"
          fontSize="24px"
          fontWeight="bold"
          textAlign="center"
          margin="0 0 24px 0"
        />
        <Element
          is={Container}
          canvas
          padding="16px"
          background={theme.colors.background.tertiary}
          borderRadius="8px"
        >
          <Text text="This is an inner container." />
        </Element>
      </Element>
    </DeviceFrame>
  );
};
