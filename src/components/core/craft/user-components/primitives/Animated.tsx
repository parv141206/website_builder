"use client";

import React, { useRef, useEffect, type ReactNode } from "react";
import { useNode } from "@craftjs/core";
import { motion, type MotionProps } from "motion/react";

type NewType = {
  children: ReactNode;
  hoverEffect?: boolean;
  glow?: boolean;
};

export type AnimatedProps = MotionProps & NewType;

export const Animated: React.FC<AnimatedProps> & { craft?: unknown } = ({
  children,
  hoverEffect = true,
  glow = false,
  ...motionProps
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      connect(drag(wrapperRef.current));
    }
  }, [connect, drag]);

  return (
    <motion.div
      ref={wrapperRef}
      className={`relative ${
        glow
          ? "before:absolute before:inset-0 before:animate-pulse before:rounded-2xl before:bg-gradient-to-r before:from-purple-500/20 before:to-cyan-500/20 before:blur-2xl"
          : ""
      }`}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={
        hoverEffect ? { scale: 1.02, y: -4, transition: { duration: 0.3 } } : {}
      }
      whileTap={hoverEffect ? { scale: 0.98 } : {}}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

Animated.craft = {
  displayName: "Animated",
  props: {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  rules: { canDrag: () => true },
};
