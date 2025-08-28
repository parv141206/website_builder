"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Container } from "../../primitives/Container";
import { Text } from "../../primitives/Typography/Text";

interface CommentCardProps {
  defaultText?: string;
  hoverText?: string;
  background?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  transition?: string;
  backdropFilter?: string;
  boxShadow?: string;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  defaultText = "View Comment",
  hoverText = "This is the actual hidden comment that appears on hover.",
  background = "white",
  padding = "1.25rem",
  borderRadius = "0.75rem",
  border = "1px solid #e5e7eb",
  textColor = "black",
  fontSize = "1rem",
  fontWeight = "600",
  transition = "all 0.35s ease-in-out",
  backdropFilter = "blur(8px)",
  boxShadow = "0 8px 20px rgba(0, 0, 0, 0.08)",
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const [hover, setHover] = useState(false);

  return (
    <Container
      ref={(ref: any) => connect(drag(ref))}
      style={{
        background,
        padding,
        borderRadius,
        border,
        color: textColor,
        fontSize,
        fontWeight,
        transition,
        backdropFilter,
        boxShadow,
        cursor: "pointer",
        textAlign: "center",
        minWidth: "200px",
        minHeight: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Text>{hover ? hoverText : defaultText}</Text>
    </Container>
  );
};
