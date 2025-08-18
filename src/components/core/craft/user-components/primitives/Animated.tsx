"use client";

import React, { useRef, useEffect, type ReactNode } from "react";
import { useNode } from "@craftjs/core";
import { motion, type MotionProps } from "motion/react";

export type AnimatedProps = MotionProps & {
  children: ReactNode;
};

/**
 * Animated primitive for Craft.js
 * Wraps any content and adds motion/react animations
 */
export const Animated: React.FC<AnimatedProps> & { craft?: unknown } = ({
  children,
  ...motionProps
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) connect(drag(wrapperRef.current));
  }, [connect, drag]);

  return (
    <motion.div ref={wrapperRef} {...motionProps}>
      {children}
    </motion.div>
  );
};

// Craft.js editor configuration
Animated.craft = {
  displayName: "Animated",
  props: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  rules: { canDrag: () => true },
};
