// Container.tsx

"use client";

import { theme } from "../../theme";
import { useRef } from "react";
import React, { useMemo } from "react";
import { motion, type Variants } from "motion/react";

// ==================================================================================
// SECTION 1: SELF-CONTAINED STATIC BACKGROUND DEFINITIONS
// ==================================================================================

// Helper to convert hex to an "r, g, b" string for use in rgba().
const hexToRgb = (hex: string): string => {
  if (!hex || typeof hex !== "string") return "255, 255, 255";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 255, 255"; // Default to white if parsing fails
};

// The 'style' property is a function that accepts a base color, pattern color, opacity, and size.
const FANCY_BACKGROUNDS: Record<string, {
  name: string;
  style: (baseColor: string, patternColor: string, patternOpacity: number, patternSize: number) => React.CSSProperties;
}> = {
  graphGrid: {
    name: "Graph Grid",
    style: (baseColor, patternColor, patternOpacity, patternSize) => {
      const patternRgba = `rgba(${hexToRgb(patternColor)}, ${patternOpacity})`;
      return {
        backgroundColor: baseColor,
        backgroundImage: `
          linear-gradient(${patternRgba} 1px, transparent 1px),
          linear-gradient(90deg, ${patternRgba} 1px, transparent 1px)
        `,
        backgroundSize: `${patternSize}px ${patternSize}px`
      };
    }
  },
  diagonalLines: {
    name: "Diagonal Lines",
    style: (baseColor, patternColor, patternOpacity, patternSize) => {
      const patternRgba = `rgba(${hexToRgb(patternColor)}, ${patternOpacity})`;
      return {
        backgroundColor: baseColor,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          ${patternRgba},
          ${patternRgba} 1px,
          transparent 1px,
          transparent ${patternSize}px
        )`
      };
    }
  },
  dotGrid: {
    name: "Dot Grid",
    style: (baseColor, patternColor, patternOpacity, patternSize) => {
      const patternRgba = `rgba(${hexToRgb(patternColor)}, ${patternOpacity})`;
      return {
        backgroundColor: baseColor,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${patternRgba} 1px, transparent 0)`,
        backgroundSize: `${patternSize}px ${patternSize}px`
      };
    }
  },
  concentricCircles: {
    name: "Concentric Circles",
    style: (baseColor, patternColor, patternOpacity, patternSize) => {
      const patternRgba = `rgba(${hexToRgb(patternColor)}, ${patternOpacity})`;
      return {
        backgroundColor: baseColor,
        backgroundImage: `repeating-radial-gradient(
              circle,
              ${patternRgba},
              ${patternRgba} 1px,
              transparent 1px,
              transparent ${patternSize}px
          )`
      };
    }
  }
};

// ==================================================================================
// SECTION 2: COMPONENT PROPS AND LOGIC
// ==================================================================================

export type AnimationProps = {
  animationEnabled?: boolean;
  animationType?: "fadeIn" | "slideIn" | "scaleUp";
  transitionDuration?: number;
  transitionDelay?: number;
  transitionEase?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  slideInOffset?: number;
  slideInDirection?: "up" | "down" | "left" | "right";
  scaleUpAmount?: number;
  animateOnce?: boolean;
};
export type ContainerProps = {
  as?: React.ElementType;
  display?: "block" | "flex" | "grid" | "inline-block" | "inline-flex" | "inline-grid";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  alignItems?: "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
  alignContent?: "stretch" | "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridAutoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  margin?: string;
  padding?: string;
  backgroundType?: string;
  backgroundColor?: string;
  patternColor?: string;
  patternOpacity?: number;
  patternSize?: number;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted" | "double";
  borderRadius?: string;
  boxShadow?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  children?: React.ReactNode;
  animation?: AnimationProps;
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
};
export const Container: React.FC<ContainerProps> = ({
  as: Tag = "div",
  children,
  animation,
  backgroundType = "color",
  backgroundColor,
  patternColor,
  patternOpacity,
  patternSize,
  position,
  top,
  right,
  bottom,
  left,
  zIndex,
  ...props
}) => {
  const containerRef = useRef(null);
  const style: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      display: props.display,
      flexDirection: props.flexDirection,
      flexWrap: props.flexWrap,
      justifyContent: props.justifyContent,
      alignItems: props.alignItems,
      alignContent: props.alignContent,
      gridTemplateColumns: props.gridTemplateColumns,
      gridTemplateRows: props.gridTemplateRows,
      gridAutoFlow: props.gridAutoFlow,
      width: props.width,
      height: props.height,
      minWidth: props.minWidth,
      minHeight: props.minHeight,
      maxWidth: props.maxWidth,
      maxHeight: props.maxHeight,
      margin: props.margin,
      padding: props.padding,
      borderColor: props.borderColor,
      borderWidth: props.borderWidth,
      borderStyle: props.borderStyle,
      borderRadius: props.borderRadius,
      boxShadow: props.boxShadow,
      fontSize: props.fontSize,
      zIndex: zIndex || "auto",
      color: props.color || theme.colors.text.body,
      fontFamily: props.fontFamily || theme.fonts.body,
      transition: "outline 120ms ease",
      position: position,
      top: top,
      right: right,
      bottom: bottom,
      left: left
    };
    const baseColor = backgroundColor || theme.colors.background.secondary;
    const finalPatternColor = patternColor || theme.colors.text.muted;
    const finalPatternOpacity = patternOpacity ?? 0.1;
    const finalPatternSize = patternSize ?? 20;
    const selectedBgFn = FANCY_BACKGROUNDS[backgroundType]?.style;
    if (selectedBgFn) {
      Object.assign(baseStyle, selectedBgFn(baseColor, finalPatternColor, finalPatternOpacity, finalPatternSize));
    } else {
      baseStyle.background = backgroundColor || theme.colors.background.primary;
    }
    if (props.gap) {
      baseStyle.gap = props.gap;
    } else {
      baseStyle.rowGap = props.rowGap;
      baseStyle.columnGap = props.columnGap;
    }
    return baseStyle;
  }, [props, backgroundType, backgroundColor, patternColor, patternOpacity, patternSize, theme, position, top, right, bottom, left, zIndex]);
  const animationVariants: Variants = useMemo(() => {
    const {
      animationType = "fadeIn",
      slideInOffset = 50,
      slideInDirection = "up",
      scaleUpAmount = 0.9
    } = animation || {};
    const initial = {
      fadeIn: {
        opacity: 0
      },
      slideIn: {
        opacity: 0,
        y: slideInDirection === "up" ? slideInOffset : slideInDirection === "down" ? -slideInOffset : 0,
        x: slideInDirection === "left" ? slideInOffset : slideInDirection === "right" ? -slideInOffset : 0
      },
      scaleUp: {
        opacity: 0,
        scale: scaleUpAmount
      }
    };
    const animate = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1
    };
    return {
      hidden: initial[animationType],
      visible: animate
    };
  }, [animation]);
  const MotionTag = motion(Tag as React.ElementType);
  if (animation?.animationEnabled) {
    return <MotionTag ref={el => {
      containerRef.current = el;
    }} style={style} variants={animationVariants} initial="hidden" whileInView="visible" viewport={{
      once: animation.animateOnce ?? true
    }} transition={{
      duration: animation.transitionDuration ?? 0.5,
      delay: animation.transitionDelay ?? 0,
      ease: animation.transitionEase ?? "easeInOut"
    }}>
        {children}
      </MotionTag>;
  }
  return <Tag ref={el => {
    containerRef.current = el;
  }} style={style}>
      {children}
    </Tag>;
};

// ==================================================================================
// SECTION 3: CRAFT.JS CONFIGURATION
// ==================================================================================