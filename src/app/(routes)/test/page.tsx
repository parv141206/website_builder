"use client";
import React from "react";
import { Container } from "./components/Container";
import { Text } from "./components/Text";

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
      <Container
        display="flex"
        flexDirection="column"
        gap="8px"
        padding="16px"
        width="100%"
        background="#ff3838"
        borderRadius="8px"
        boxShadow="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
      >
        <Text
          text="Something"
          as="h3"
          fontSize="20px"
          fontWeight="bold"
          lineHeight="1.5"
          textAlign="left"
          id="Card1-title"
          margin="0 0 8px 0"
        />
        <Text
          text="Also something"
          as="p"
          fontSize="14px"
          fontWeight={400}
          lineHeight="1.5"
          textAlign="left"
          id="Card1-description"
          color="#6b7280"
        />
      </Container>
    </div>
  );
}
