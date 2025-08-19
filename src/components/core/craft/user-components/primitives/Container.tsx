"use client";
import React, { useEffect, useMemo } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";
import { motion, type Variants } from "motion/react";

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
  // layout
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

  // grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridAutoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";

  // box
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;

  margin?: string;
  padding?: string;
  background?: string;

  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted" | "double";
  borderRadius?: string;
  boxShadow?: string;

  // text defaults
  color?: string;
  fontFamily?: string;
  fontSize?: string;

  // canvas flag is via craft config
  children?: React.ReactNode;
  animation?: AnimationProps;
};

export const Container: React.FC<ContainerProps> & { craft?: any } = ({
  as: Tag = "div",
  children,
  animation,
  ...props // Use spread for remaining props
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
      background: props.background || theme.colors.background.primary,
      color: props.color || theme.colors.text.body,
      fontFamily: props.fontFamily || theme.fonts.body,
      outline: selected ? "2px dashed #4c8bf5" : undefined,
      outlineOffset: "2px",
      transition: "outline 120ms ease",
    };

    if (props.gap) {
      baseStyle.gap = props.gap;
    } else {
      baseStyle.rowGap = props.rowGap;
      baseStyle.columnGap = props.columnGap;
    }

    return baseStyle;
  }, [props, selected, theme]);

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

    const animate = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    };

    return {
      hidden: initial[animationType],
      visible: animate,
    };
  }, [animation]);
  useEffect(() => {}, []);
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
        <div>{children}</div>
      </MotionTag>
    );
  }

  return (
    <Tag ref={(ref: any) => connect(drag(ref))} style={style}>
      {children}
    </Tag>
  );
};

Container.craft = {
  displayName: "Container",
  props: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px",
    width: "100%",
    // FIX 1: Initialize the animation object with default values.
    // This prevents `props.animation` from being undefined.
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
  } satisfies ContainerProps,
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
  },
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
            { key: "background", type: "color", label: "Background" },
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
              // FIX 2: Use optional chaining (?.) for safer property access.
              if: (props) => props.animation?.animationEnabled,
            },
            {
              key: "animation.transitionDuration",
              type: "number",
              label: "Duration (s)",
              step: 0.1,
              if: (props) => props.animation?.animationEnabled,
            },
            {
              key: "animation.transitionDelay",
              type: "number",
              label: "Delay (s)",
              step: 0.1,
              if: (props) => props.animation?.animationEnabled,
            },
            {
              key: "animation.transitionEase",
              type: "select",
              label: "Easing",
              options: ["linear", "easeIn", "easeOut", "easeInOut"],
              if: (props) => props.animation?.animationEnabled,
            },
            {
              key: "animation.slideInOffset",
              type: "number",
              label: "Slide Offset (px)",
              if: (props) =>
                props.animation?.animationEnabled &&
                props.animation?.animationType === "slideIn",
            },
            {
              key: "animation.slideInDirection",
              type: "select",
              label: "Slide Direction",
              options: ["up", "down", "left", "right"],
              if: (props) =>
                props.animation?.animationEnabled &&
                props.animation?.animationType === "slideIn",
            },
            {
              key: "animation.scaleUpAmount",
              type: "number",
              label: "Initial Scale",
              step: 0.1,
              if: (props) =>
                props.animation?.animationEnabled &&
                props.animation?.animationType === "scaleUp",
            },
            {
              key: "animation.animateOnce",
              type: "boolean",
              label: "Animate Only Once",
              if: (props) => props.animation?.animationEnabled,
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
