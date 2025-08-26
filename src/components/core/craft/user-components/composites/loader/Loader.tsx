"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Animated } from "../../primitives/Animated";

export type LoaderProps = {
  containerProps?: Partial<ContainerProps>;
};

export const Loader: React.FC<LoaderProps> & { craft?: any } = ({
  containerProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  // Letters with their paths (LOADING)
  const letters = [
    // L
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 18" height={48}>
          <path fill="black" d="M2 1H5V15H11V17H2V1Z" />
        </svg>
      ),
    },
    // O
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 18" height={48}>
          <path
            fill="black"
            d="M8 17C3.6 17 0 13.4 0 9C0 4.6 3.6 1 8 1C12.4 1 16 4.6 16 9C16 13.4 12.4 17 8 17ZM8 3C5.2 3 3 5.2 3 8C3 10.8 5.2 13 8 13C10.8 13 13 10.8 13 8C13 5.2 10.8 3 8 3Z"
          />
        </svg>
      ),
    },
    // A
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 18" height={48}>
          <path
            fill="black"
            d="M7.5 1L14.5 17H10.9L9.4 13H5.6L4.1 17H0.5L7.5 1ZM6.4 11H8.6L7.5 8L6.4 11Z"
          />
        </svg>
      ),
    },
    // D
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 18" height={48}>
          <path
            fill="black"
            d="M1 1H7.5C11.5 1 14 4 14 9C14 14 11.5 17 7.5 17H1V1ZM5 3V15H7.2C9.8 15 12 12.8 12 9C12 5.2 9.8 3 7.2 3H5Z"
          />
        </svg>
      ),
    },
    // I
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 18" height={48}>
          <path fill="black" d="M2 1H4V17H2V1Z" />
        </svg>
      ),
    },
    // N
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 18" height={48}>
          <path fill="black" d="M1 1H5L11 11V1H14V17H10L4 7V17H1V1Z" />
        </svg>
      ),
    },
    // G
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 18" height={48}>
          <path
            fill="black"
            d="M8 17C3.6 17 0 13.4 0 9C0 4.6 3.6 1 8 1C12 1 15 3.8 15 7.5H11C11 5.6 9.7 4 8 4C5.2 4 3 6.2 3 9C3 11.8 5.2 14 8 14C9.4 14 10.6 13.4 11.3 12H8V9H15V17H12.5L12.2 15.6C11 16.6 9.6 17 8 17Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <Container
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      style={{ gap: "6px" }}
      aria-label="Loading"
      {...containerProps}
    >
      {letters.map((letter, i) => (
        <Animated
          key={i}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: i * 0.1,
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Container as="span" display="inline-flex" alignItems="center">
            {letter.svg}
          </Container>
        </Animated>
      ))}
    </Container>
  );
};

Loader.craft = {
  displayName: "Loader",
  props: {
    containerProps: {
      padding: "16px",
    },
  },
};
