"use client";

import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";
import { Animated } from "../../primitives/Animated";

interface CardSpreadProps {
  title?: string;
  theme?: "light" | "dark";
  containerProps?: Partial<ContainerProps>;
  textProps?: Partial<TextProps>;
}

export const CardSpread = ({
  title = "My Card Spread",
  theme = "light",
  containerProps,
  textProps,
}: CardSpreadProps) => {
  const [isExpanded, setExpanded] = useState(false);

  const {
    connectors: { connect, drag },
  } = useNode();

  const themeStyles = {
    light: {
      containerBackground: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
      cardBackground: "rgba(255, 255, 255, 0.9)",
      textColor: "rgb(30 41 59)", // slate-800
      shadow: "0 8px 20px rgba(0,0,0,0.12)",
      glow: "0 0 25px rgba(59,130,246,0.25)",
    },
    dark: {
      containerBackground: "linear-gradient(135deg, #1e293b, #0f172a)",
      cardBackground: "rgba(30, 41, 59, 0.85)",
      textColor: "rgb(241 245 249)", // slate-100
      shadow: "0 12px 28px rgba(0,0,0,0.65)",
      glow: "0 0 30px rgba(16,185,129,0.35)",
    },
  };

  const currentTheme = themeStyles[theme];

  const cards = [
    {
      title: "Notes",
      content: ["Write down ideas", "Plan next project"],
      accent: "linear-gradient(to right, #60a5fa, #6366f1)", // blue → indigo
    },
    {
      title: "Shopping List",
      content: ["Milk 🥛", "Eggs 🥚", "Bread 🍞"],
      accent: "linear-gradient(to right, #fb7185, #ec4899)", // rose → pink
    },
    {
      title: "Kitchen Remodel",
      content: ["Farmhouse sink", "Subway tiles", "Open shelves"],
      accent: "linear-gradient(to right, #fbbf24, #f97316)", // amber → orange
    },
    {
      title: "Reminders",
      content: ["Museum tickets 🎟️", "Call mom 📞"],
      accent: "linear-gradient(to right, #34d399, #14b8a6)", // emerald → teal
    },
  ];

  return (
    <Container
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        minHeight: "22rem",
        minWidth: "15rem",
        transition: "all 0.9s cubic-bezier(0.25, 1, 0.3, 1)",
        background: currentTheme.containerBackground,
        borderRadius: "1.5rem",
        padding: "2rem",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
        gap: isExpanded ? "1.25rem" : "0px",
      }}
      {...containerProps}
    >
      {cards.map((card, index) => {
        const baseAngle = (index - (cards.length - 1) / 2) * 12; // fan layout
        return (
          <Animated
            key={index}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              setExpanded(!isExpanded);
            }}
            style={{
              cursor: "pointer",
              width: "12rem",
              padding: "1.25rem",
              borderRadius: "1rem",
              background: currentTheme.cardBackground,
              color: currentTheme.textColor,
              boxShadow: currentTheme.shadow,
              position: "absolute",
              transform: isExpanded
                ? `translateX(${index * 180}px) translateY(${index * 12}px) rotate(0deg)`
                : `rotate(${baseAngle}deg) translateY(0)`,
              transformOrigin: "bottom center",
              transition:
                "transform 0.9s cubic-bezier(0.25, 1, 0.3, 1), box-shadow 0.6s ease",
              border: "2px solid transparent",
              backgroundImage: `linear-gradient(${currentTheme.cardBackground}, ${currentTheme.cardBackground}), ${card.accent}`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
            whileHover={{
              y: -35,
              scale: 1.08,
              zIndex: 25,
              boxShadow: `${currentTheme.shadow}, ${currentTheme.glow}`,
              transition: {
                duration: 0.4,
                ease: [0.25, 1, 0.3, 1],
              },
            }}
          >
            {/* Title */}
            <Element
              is={Text}
              id={`card-title-${index}`}
              text={card.title}
              fontSize="1.125rem"
              fontWeight="700"
              color={currentTheme.textColor}
              {...textProps}
            />

            {/* Content */}
            <Container style={{ marginTop: "0.75rem" }}>
              {card.content.map((line, i) => (
                <Text
                  key={i}
                  text={line}
                  fontSize="0.9rem"
                  fontWeight="400"
                  color={currentTheme.textColor}
                  style={{ marginBottom: "0.25rem" }}
                />
              ))}
            </Container>
          </Animated>
        );
      })}
    </Container>
  );
};

CardSpread.craft = {
  displayName: "Card Spread",
  props: {
    title: "My Card Spread",
    theme: "light",
    containerProps: {},
    textProps: {},
  },
  rules: {
    canDrag: () => true,
  },
};
