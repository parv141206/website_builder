"use client";

import React, { useState } from "react"; // Import useState
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";
import { Animated } from "../../primitives/Animated";

interface CardCommentProps {
  commenter: string;
  replier: string;
  containerProps?: Partial<ContainerProps>;
  commenterTextProps?: Partial<TextProps>;
  replierTextProps?: Partial<TextProps>;
  commentContentProps?: Partial<ContainerProps>;
  replyContentProps?: Partial<ContainerProps>;
  theme?: "light" | "dark";
}

export const CardComment = ({
  commenter,
  replier,
  containerProps,
  commenterTextProps,
  replierTextProps,
  commentContentProps,
  replyContentProps,
  theme = "light",
}: CardCommentProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  // State to manage hover for "group-like" behavior
  const [isHovered, setIsHovered] = useState(false);

  const themeStyles = {
    light: {
      cardBackground: "white",
      innerCardBackground: "rgb(245 245 245)", // neutral-50 for comment section
      commenterTextColor: "black",
      replyCardBackground: "rgb(34 197 94)", // green-500 for reply section
      replyTextColor: "white",
      pulseBackground: "rgb(209 213 219)", // neutral-300
      replyPulseBackground: "rgba(255,255,255,0.5)",
    },
    dark: {
      cardBackground: "rgb(30 41 59)", // slate-800 for outer card
      innerCardBackground: "rgb(51 65 85)", // slate-700 for comment section
      commenterTextColor: "white",
      replyCardBackground: "rgb(16 185 129)", // emerald-500 for reply section
      replyTextColor: "white",
      pulseBackground: "rgb(100 116 139)", // slate-600
      replyPulseBackground: "rgba(255,255,255,0.3)",
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <Container
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      style={{
        width: "100%",
        maxWidth: "32rem",
        height: "16rem",
        margin: "auto",
        borderRadius: "0.75rem",
        backgroundColor: currentTheme.cardBackground,
        padding: "1rem",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
      {...containerProps}
    >
      <Animated
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "14rem", // Adjusted height for inner content
          overflow: "hidden",
          borderRadius: "0.375rem",
          backgroundColor: currentTheme.innerCardBackground,
          color: currentTheme.commenterTextColor,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
        // Manage hover state on the parent Animated component
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        // Apply parent's own whileHover for its boxShadow
        whileHover={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Commenter Section */}
        <Animated
          style={{
            height: "fit-content",
            padding: "1rem",
            position: "absolute",
            width: "100%",
            top: 0,
            left: 0,
            zIndex: 2,
            backgroundColor: currentTheme.innerCardBackground,
          }}
          initial={{ y: "0%" }}
          // Animate based on parent's hover state
          animate={{ y: isHovered ? "-33.333333%" : "0%" }}
          transition={{ duration: 0.3 }}
          {...commentContentProps}
        >
          <Element
            is={Text}
            id="commenter-text"
            text={`${commenter} commented`}
            fontSize="0.875rem"
            fontWeight="600"
            color={currentTheme.commenterTextColor}
            {...commenterTextProps}
          />
          <Container
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              height: "0.75rem",
              width: "100%",
              borderRadius: "0.375rem",
              backgroundColor: currentTheme.pulseBackground,
            }}
          />
          <Container
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              height: "0.75rem",
              width: "40%",
              borderRadius: "0.375rem",
              backgroundColor: currentTheme.pulseBackground,
            }}
          />
        </Animated>

        {/* Replier Section */}
        <Animated
          style={{
            width: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            position: "absolute",
            bottom: "0%",
            left: 0,
            zIndex: 1,
          }}
          initial={{ y: "0%", opacity: 0 }}
          // Animate based on parent's hover state
          animate={{
            y: isHovered ? "-100%" : "0%",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <Container
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "0.375rem",
              backgroundColor: currentTheme.replyCardBackground,
              padding: "1rem",
            }}
            {...replyContentProps}
          >
            <Element
              is={Text}
              id="replier-text"
              text={`${replier} replied`}
              fontSize="0.875rem"
              fontWeight="600"
              color={currentTheme.replyTextColor}
              {...replierTextProps}
            />
            <Container
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                height: "0.75rem",
                width: "100%",
                borderRadius: "0.5rem",
                backgroundColor: currentTheme.replyPulseBackground,
              }}
            />
            <Container
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                height: "0.75rem",
                width: "100%",
                borderRadius: "0.5rem",
                backgroundColor: currentTheme.replyPulseBackground,
              }}
            />
            <Container
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                height: "0.75rem",
                width: "40%",
                borderRadius: "0.5rem",
                backgroundColor: currentTheme.replyPulseBackground,
              }}
            />
          </Container>
        </Animated>
      </Animated>
    </Container>
  );
};

CardComment.craft = {
  displayName: "Card Comment",
  props: {
    commenter: "Someone",
    replier: "Someone else",
    theme: "light",
    containerProps: {},
    commenterTextProps: {},
    replierTextProps: {},
    commentContentProps: {},
    replyContentProps: {},
  },
  rules: {
    canDrag: () => true,
  },
};
