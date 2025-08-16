"use client";
import React from "react";
import { Container } from "./components/Container";
import { Text } from "./components/Text";
import { Card1 } from "./components/Card1";

export default function Page() {
  return (
    <div
      display="flex"
      flexDirection="column"
      gap="8px"
      padding="24px"
      width="100%"
      id="ROOT"
      background="#ffffff"
      height="100%"
    >
      <Text
        text="Welcome to your new page!"
        as="h1"
        fontSize="24px"
        fontWeight="bold"
        lineHeight="1.5"
        textAlign="center"
        margin="0 0 24px 0"
      />
      <Container
        display="flex"
        flexDirection="column"
        gap="8px"
        padding="16px"
        width="100%"
        background="#f3f4f6"
        borderRadius="8px"
      >
        <Text
          text="This is an inner container. Drag components here or double-click to edit text."
          as="p"
          fontSize="16px"
          fontWeight={400}
          lineHeight="1.5"
          textAlign="left"
        />
      </Container>
      <Card1
        title="Something"
        description="Also something"
        animationIn="fadeIn"
        animationHover="lift"
        animationDuration={0.5}
      />
    </div>
  );
}
