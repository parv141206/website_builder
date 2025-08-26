"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";
import { Animated } from "../../primitives/Animated";

export type SocialCardProps = {
  containerProps?: Partial<ContainerProps>;
  textProps?: Partial<TextProps>;
};

export const SocialCard: React.FC<SocialCardProps> & { craft?: unknown } = ({
  containerProps,
  textProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const socials = [
    {
      name: "Facebook",
      svg: (
        <svg
          viewBox="0 0 320 512"
          xmlns="http://www.w3.org/2000/svg"
          height={30}
        >
          <path
            d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 
            12.42-50.06 52.24-50.06h40.42V6.26S260.43 
            0 225.36 0c-73.22 0-121.08 44.38-121.08 
            124.72v70.62H22.89V288h81.39v224h100.17V288z"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          height={30}
        >
          <path
            d="M459.37 151.716c.325 4.548.325 
            9.097.325 13.645 0 138.72-105.583 
            298.558-298.558 298.558-59.452 0-114.68-17.219-
            161.137-47.106 8.447.974 16.568 1.299 25.34 
            1.299 49.055 0 94.213-16.568 
            130.274-44.832-46.132-.975-84.792-31.188-
            98.112-72.772z"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          height={30}
        >
          <path
            d="M224.1 141c-63.6 0-114.9 
            51.3-114.9 114.9s51.3 114.9 
            114.9 114.9S339 319.5 339 255.9 
            287.7 141 224.1 141zm0 
            189.6c-41.1 0-74.7-33.5-74.7-
            74.7s33.5-74.7 74.7-74.7 
            74.7 33.5 74.7 74.7-33.6 
            74.7-74.7 74.7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <Animated
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
      }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        borderRadius: "15px",
        boxShadow:
          "inset 0 0 20px rgba(255,255,255,0.192), inset 0 0 5px rgba(255,255,255,0.274), 0 5px 5px rgba(0,0,0,0.164)",
        backdropFilter: "blur(15px)",
        gap: "1rem",
      }}
      {...containerProps}
    >
      {socials.map((item, idx) => (
        <Animated
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.15, duration: 0.5, ease: "easeOut" }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Animated
            whileHover={{
              scale: 1.15,
              rotate: [0, -5, 5, 0], // playful wobble
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              borderRadius: "50%",
              padding: "1rem",
              height: "60px",
              width: "60px",
              color: "rgb(255,174,0)",
              fill: "currentColor",
              boxShadow:
                "inset 0 0 20px rgba(255,255,255,0.3), inset 0 0 5px rgba(255,255,255,0.5), 0 5px 5px rgba(0,0,0,0.164)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.svg}
          </Animated>

          <Element
            is={Text}
            id={`SocialCard-${item.name}`}
            text={item.name}
            as="span"
            fontSize="14px"
            margin="8px 0 0 0"
            style={{
              backgroundColor: "rgba(255,255,255,0.3)",
              color: "rgb(255,174,0)",
              borderRadius: "5px",
              padding: "4px 8px",
              boxShadow:
                "-5px 0 1px rgba(153,153,153,0.2), -10px 0 1px rgba(153,153,153,0.2), inset 0 0 20px rgba(255,255,255,0.3), inset 0 0 5px rgba(255,255,255,0.5), 0 5px 5px rgba(0,0,0,0.082)",
            }}
            {...textProps}
          />
        </Animated>
      ))}
    </Animated>
  );
};

SocialCard.craft = {
  displayName: "Social Card",
  props: {
    containerProps: {},
    textProps: {},
  },
  rules: {
    canDrag: () => true,
  },
};
