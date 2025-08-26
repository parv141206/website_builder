"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";
import { Animated } from "../../primitives/Animated";

export type RotateCardProps = {
  containerProps?: Partial<ContainerProps>;
  textProps?: Partial<TextProps>;
};

export const RotateCard: React.FC<RotateCardProps> & { craft?: unknown } = ({
  containerProps,
  textProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      style={{
        perspective: "1000px", // enables 3D space
        width: "300px",
        height: "200px",
      }}
    >
      <Animated
        whileHover={{ rotateY: 180 }} // full flip
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          transformStyle: "preserve-3d", // keeps front & back in 3D
          cursor: "pointer",
        }}
        {...containerProps}
      >
        {/* Front Side */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(-45deg, #f89b29 0%, #ff0f7b 100%)",
            borderRadius: "10px",
            backfaceVisibility: "hidden", // hide when flipped
          }}
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "48px", fill: "#333" }}
          >
            <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
          </svg>
        </div>

        {/* Back Side */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: "20px",
            boxSizing: "border-box",
            transform: "rotateY(180deg)", // flipped side
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Element
            is={Text}
            id="RotateCard-Title"
            text="Card Title"
            fontSize="24px"
            fontWeight="700"
            color="#333"
            {...textProps}
          />
          <Element
            is={Text}
            id="RotateCard-Description"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            fontSize="14px"
            color="#777"
            style={{ marginTop: "10px", lineHeight: "1.4" }}
            {...textProps}
          />
        </div>
      </Animated>
    </div>
  );
};

RotateCard.craft = {
  displayName: "Rotate Card",
  props: {
    containerProps: {},
    textProps: {},
  },
  rules: {
    canDrag: () => true,
  },
};
