"use client";
import React, { useMemo } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";
import { motion, type Variants } from "motion/react";

// ==================================================================================
// SECTION 1: SELF-CONTAINED STATIC BACKGROUND DEFINITIONS
// ==================================================================================

// Helper to convert hex to an "r, g, b" string for use in rgba().
const hexToRgb = (hex: string): string => {
  if (!hex || typeof hex !== "string") return "255, 255, 255";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "255, 255, 255"; // Default to white if parsing fails
};

// The 'style' property is a function that accepts a base color, pattern color, opacity, and size.
const FANCY_BACKGROUNDS: Record<
  string,
  {
    name: string;
    style: (
      baseColor: string,
      patternColor: string,
      patternOpacity: number,
      patternSize: number,
    ) => React.CSSProperties;
  }
> = {
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
        backgroundSize: `${patternSize}px ${patternSize}px`,
      };
    },
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
        )`,
      };
    },
  },
  dotGrid: {
    name: "Dot Grid",
    style: (baseColor, patternColor, patternOpacity, patternSize) => {
      const patternRgba = `rgba(${hexToRgb(patternColor)}, ${patternOpacity})`;
      return {
        backgroundColor: baseColor,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${patternRgba} 1px, transparent 0)`,
        backgroundSize: `${patternSize}px ${patternSize}px`,
      };
    },
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
          )`,
      };
    },
  },
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
  display?:
    | "block"
    | "flex"
    | "grid"
    | "inline-block"
    | "inline-flex"
    | "inline-grid";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
  alignContent?:
    | "stretch"
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
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
};

export const Container: React.FC<ContainerProps> & { craft?: any } = ({
  as: Tag = "div",
  children,
  animation,
  backgroundType = "color",
  backgroundColor,
  patternColor,
  patternOpacity,
  patternSize,
  ...props
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const theme = useTheme();

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
      zIndex: "2",
      color: props.color || theme.colors.text.body,
      fontFamily: props.fontFamily || theme.fonts.body,
      outline: selected ? "2px dashed #4c8bf5" : undefined,
      outlineOffset: "2px",
      transition: "outline 120ms ease",
    };

    const baseColor = backgroundColor || theme.colors.background.secondary;
    const finalPatternColor = patternColor || theme.colors.text.muted;
    const finalPatternOpacity = patternOpacity ?? 0.1;
    const finalPatternSize = patternSize ?? 20;

    const selectedBgFn = FANCY_BACKGROUNDS[backgroundType]?.style;

    if (selectedBgFn) {
      Object.assign(
        baseStyle,
        selectedBgFn(
          baseColor,
          finalPatternColor,
          finalPatternOpacity,
          finalPatternSize,
        ),
      );
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
  }, [
    props,
    backgroundType,
    backgroundColor,
    patternColor,
    patternOpacity,
    patternSize,
    selected,
    theme,
  ]);

  const animationVariants: Variants = useMemo(() => {
    const {
      animationType = "fadeIn",
      slideInOffset = 50,
      slideInDirection = "up",
      scaleUpAmount = 0.9,
    } = animation || {};
    const initial = {
      fadeIn: { opacity: 0 },
      slideIn: {
        opacity: 0,
        y:
          slideInDirection === "up"
            ? slideInOffset
            : slideInDirection === "down"
              ? -slideInOffset
              : 0,
        x:
          slideInDirection === "left"
            ? slideInOffset
            : slideInDirection === "right"
              ? -slideInOffset
              : 0,
      },
      scaleUp: { opacity: 0, scale: scaleUpAmount },
    };
    const animate = { opacity: 1, y: 0, x: 0, scale: 1 };
    return { hidden: initial[animationType], visible: animate };
  }, [animation]);

  const MotionTag = motion(Tag as React.ElementType);

  if (animation?.animationEnabled) {
    return (
      <MotionTag
        ref={(ref: any) => connect(drag(ref))}
        style={style}
        variants={animationVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: animation.animateOnce ?? true }}
        transition={{
          duration: animation.transitionDuration ?? 0.5,
          delay: animation.transitionDelay ?? 0,
          ease: animation.transitionEase ?? "easeInOut",
        }}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <Tag ref={(ref: any) => connect(drag(ref))} style={style}>
      {children}
    </Tag>
  );
};

// ==================================================================================
// SECTION 3: CRAFT.JS CONFIGURATION
// ==================================================================================
Container.craft = {
  displayName: "Container",
  props: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "24px",
    width: "100%",
    backgroundType: "color",
    backgroundColor: undefined,
    patternColor: undefined,
    patternOpacity: 0.1,
    patternSize: 20,
    animation: {
      animationEnabled: false,
      animationType: "fadeIn",
      transitionDuration: 0.5,
      transitionDelay: 0,
      transitionEase: "easeInOut",
      slideInOffset: 50,
      slideInDirection: "up",
      scaleUpAmount: 0.9,
      animateOnce: true,
    },
  } satisfies Partial<ContainerProps>,
  rules: { canDrag: () => true, canMoveIn: () => true },
  isCanvas: true,
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Layout",
          fields: [
            {
              key: "display",
              type: "select",
              label: "Display",
              options: [
                "block",
                "flex",
                "grid",
                "inline-block",
                "inline-flex",
                "inline-grid",
              ],
            },
            {
              key: "flexDirection",
              type: "select",
              label: "Flex Direction",
              options: ["row", "column", "row-reverse", "column-reverse"],
            },
            {
              key: "flexWrap",
              type: "select",
              label: "Flex Wrap",
              options: ["nowrap", "wrap", "wrap-reverse"],
              allowUndefined: true,
            },
            {
              key: "justifyContent",
              type: "select",
              label: "Justify",
              options: [
                "flex-start",
                "center",
                "flex-end",
                "space-between",
                "space-around",
                "space-evenly",
              ],
              allowUndefined: true,
            },
            {
              key: "alignItems",
              type: "select",
              label: "Align Items",
              options: [
                "stretch",
                "flex-start",
                "center",
                "flex-end",
                "baseline",
              ],
              allowUndefined: true,
            },
            {
              key: "alignContent",
              type: "select",
              label: "Align Content",
              options: [
                "stretch",
                "flex-start",
                "center",
                "flex-end",
                "space-between",
                "space-around",
              ],
              allowUndefined: true,
            },
            { key: "gap", type: "text", label: "Gap" },
            { key: "rowGap", type: "text", label: "Row Gap" },
            { key: "columnGap", type: "text", label: "Column Gap" },
            { key: "gridTemplateColumns", type: "text", label: "Grid Columns" },
            { key: "gridTemplateRows", type: "text", label: "Grid Rows" },
            {
              key: "gridAutoFlow",
              type: "select",
              label: "Grid Auto Flow",
              options: ["row", "column", "dense", "row dense", "column dense"],
              allowUndefined: true,
            },
          ],
        },
        {
          label: "Box",
          fields: [
            { key: "width", type: "text", label: "Width" },
            { key: "height", type: "text", label: "Height" },
            { key: "minWidth", type: "text", label: "Min Width" },
            { key: "minHeight", type: "text", label: "Min Height" },
            { key: "maxWidth", type: "text", label: "Max Width" },
            { key: "maxHeight", type: "text", label: "Max Height" },
            { key: "margin", type: "text", label: "Margin" },
            { key: "padding", type: "text", label: "Padding" },
            {
              key: "backgroundType",
              type: "select",
              label: "BG Type",
              options: [
                { label: "Solid Color", value: "color" },
                ...Object.entries(FANCY_BACKGROUNDS).map(([id, { name }]) => ({
                  label: name,
                  value: id,
                })),
              ],
            },
            {
              key: "backgroundColor",
              type: "color",
              label: (props: ContainerProps) =>
                props.backgroundType && props.backgroundType !== "color"
                  ? "Base Color"
                  : "Background Color",
            },
            {
              key: "patternColor",
              type: "color",
              label: "Pattern Color",
              if: (props: ContainerProps) =>
                props.backgroundType && props.backgroundType !== "color",
            },
            {
              key: "patternOpacity",
              type: "number",
              label: "Pattern Opacity",
              min: 0,
              max: 1,
              step: 0.01,
              if: (props: ContainerProps) =>
                props.backgroundType && props.backgroundType !== "color",
            },
            {
              key: "patternSize",
              type: "number",
              label: "Pattern Size (px)",
              min: 1,
              step: 1,
              if: (props: ContainerProps) =>
                props.backgroundType && props.backgroundType !== "color",
            },
            { key: "borderColor", type: "color", label: "Border Color" },
            { key: "borderWidth", type: "text", label: "Border Width" },
            {
              key: "borderStyle",
              type: "select",
              label: "Border Style",
              options: ["none", "solid", "dashed", "dotted", "double"],
            },
            { key: "borderRadius", type: "text", label: "Radius" },
            { key: "boxShadow", type: "text", label: "Shadow" },
          ],
        },
        {
          label: "Animation",
          fields: [
            {
              key: "animation.animationEnabled",
              type: "boolean",
              label: "Enable Animation",
            },
            {
              key: "animation.animationType",
              type: "select",
              label: "Animation Type",
              options: ["fadeIn", "slideIn", "scaleUp"],
              if: (props: ContainerProps) => props.animation?.animationEnabled,
            },
            {
              key: "animation.transitionDuration",
              type: "number",
              label: "Duration (s)",
              step: 0.1,
              if: (props: ContainerProps) => props.animation?.animationEnabled,
            },
            {
              key: "animation.transitionDelay",
              type: "number",
              label: "Delay (s)",
              step: 0.1,
              if: (props: ContainerProps) => props.animation?.animationEnabled,
            },
            {
              key: "animation.transitionEase",
              type: "select",
              label: "Easing",
              options: ["linear", "easeIn", "easeOut", "easeInOut"],
              if: (props: ContainerProps) => props.animation?.animationEnabled,
            },
            {
              key: "animation.slideInOffset",
              type: "number",
              label: "Slide Offset (px)",
              if: (props: ContainerProps) =>
                props.animation?.animationEnabled &&
                props.animation?.animationType === "slideIn",
            },
            {
              key: "animation.slideInDirection",
              type: "select",
              label: "Slide Direction",
              options: ["up", "down", "left", "right"],
              if: (props: ContainerProps) =>
                props.animation?.animationEnabled &&
                props.animation?.animationType === "slideIn",
            },
            {
              key: "animation.scaleUpAmount",
              type: "number",
              label: "Initial Scale",
              step: 0.1,
              if: (props: ContainerProps) =>
                props.animation?.animationEnabled &&
                props.animation?.animationType === "scaleUp",
            },
            {
              key: "animation.animateOnce",
              type: "boolean",
              label: "Animate Only Once",
              if: (props: ContainerProps) => props.animation?.animationEnabled,
            },
          ],
        },
        {
          label: "Typography",
          fields: [
            { key: "color", type: "color", label: "Text Color" },
            { key: "fontFamily", type: "text", label: "Font Family" },
            { key: "fontSize", type: "text", label: "Font Size" },
          ],
        },
      ],
    },
  },
};
