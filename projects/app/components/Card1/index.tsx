"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { motion, type Variant } from "motion/react";
import { Container } from "../../primitives/Container";
import { Text } from "../../primitives/Text";
export type Card1Props = {
  title: string;
  description: string;
  animationIn: "none" | "fadeIn" | "slideInLeft";
  animationHover: "none" | "grow" | "lift";
  animationDuration: number;
};
export const Card1: React.FC<Card1Props> & {
  craft?: any;
} = ({
  title,
  description,
  animationIn,
  animationHover,
  animationDuration
}) => {
  const {
    connectors: {
      connect,
      drag
    },
    selected
  } = useNode(node => ({
    selected: node.events.selected
  }));
  const cardRef = useRef<HTMLDivElement>(null);

  // ✅ Connect only after mount to avoid store updates during render
  useEffect(() => {
    if (cardRef.current) {
      connect(drag(cardRef.current));
    }
  }, [connect, drag]);
  const variants = useMemo(() => {
    const initial: Variant = {};
    const animate: Variant = {};
    switch (animationIn) {
      case "fadeIn":
        initial.opacity = 0;
        animate.opacity = 1;
        break;
      case "slideInLeft":
        initial.opacity = 0;
        initial.x = -50;
        animate.opacity = 1;
        animate.x = 0;
        break;
    }
    return {
      initial,
      animate
    };
  }, [animationIn]);
  const hoverEffect = useMemo(() => {
    switch (animationHover) {
      case "grow":
        return {
          scale: 1.05
        };
      case "lift":
        return {
          y: -5
        };
      default:
        return {};
    }
  }, [animationHover]);
  const cardStyle = useMemo(() => ({}), []);
  return <motion.div ref={cardRef} style={cardStyle} initial={{
    opacity: 0,
    y: 5
  }} animate={{
    opacity: 1,
    y: 0
  }} variants={variants} whileHover={hoverEffect} transition={{
    duration: animationDuration || 0.5
  }}>
      <Element is={Container} canvas id="Card1-content" padding="16px" background="#ffffff" borderRadius="8px" boxShadow="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)">
        <Element is={Text as any} id="Card1-title" text={title} as="h3" fontSize="20px" fontWeight="bold" margin="0 0 8px 0" />
        <Element is={Text as any} id="Card1-description" text={description} as="p" fontSize="14px" color="#6b7280" />
      </Element>
    </motion.div>;
};