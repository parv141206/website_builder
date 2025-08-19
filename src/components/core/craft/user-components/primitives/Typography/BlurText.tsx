"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";
import { motion, type Easing } from "motion/react";

// ==================================================================================
// SECTION 1: PROPS TYPE DEFINITION
// ==================================================================================
export type BlurTextProps = {
  text: string;

  // Typography & Styling
  color?: string;
  fontSize?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "justify";

  // Spacing
  margin?: string;
  padding?: string;

  // Animation Settings
  animateBy: "words" | "chars";
  duration: number;
  delay: number; // Stagger delay in ms
  ease: Easing | string;

  // 'From' State (Start)
  fromBlur: number;
  fromOpacity: number;
  fromY: number;

  // 'To' State (End) - Simplified from original
  toBlur: number;
  toOpacity: number;
  toY: number;

  // Scroll Trigger Settings
  threshold: number;
  rootMargin: string;
};

// ==================================================================================
// SECTION 2: THE CRAFT.JS COMPONENT
// ==================================================================================
export const BlurText: React.FC<BlurTextProps> & { craft?: any } = (props) => {
  const {
    text,
    textAlign,
    animateBy,
    duration,
    delay,
    ease,
    threshold,
    rootMargin,
  } = props;

  // ----------------------------------------------------------------------------------
  // CRAFT.JS HOOKS & THEME
  // ----------------------------------------------------------------------------------
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));
  const theme = useTheme();

  // ----------------------------------------------------------------------------------
  // COMPONENT LOGIC (Adapted from original)
  // ----------------------------------------------------------------------------------
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Reconstruct 'from' and 'to' animation states from flattened props
  const fromState = useMemo(
    () => ({
      filter: `blur(${props.fromBlur}px)`,
      opacity: props.fromOpacity,
      y: props.fromY,
    }),
    [props.fromBlur, props.fromOpacity, props.fromY],
  );

  const toState = useMemo(
    () => ({
      filter: `blur(${props.toBlur}px)`,
      opacity: props.toOpacity,
      y: props.toY,
    }),
    [props.toBlur, props.toOpacity, props.toY],
  );

  // ----------------------------------------------------------------------------------
  // JSX RETURN
  // ----------------------------------------------------------------------------------
  return (
    <p
      ref={(el: HTMLParagraphElement | null) => {
        if (el) {
          connect(drag(el));
          ref.current = el;
        }
      }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent:
          textAlign === "center"
            ? "center"
            : textAlign === "right"
              ? "flex-end"
              : "flex-start",
        textAlign,
        // Apply styling props
        color: props.color || theme.colors.text.body,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        fontFamily: props.fontFamily || theme.fonts.body,
        margin: props.margin,
        padding: props.padding,
        // Editor-specific outline
        outline: selected ? "2px dashed #4c8bf5" : "none",
        outlineOffset: "2px",
      }}
    >
      {elements.map((segment, index) => (
        <motion.span
          className="inline-block"
          key={index}
          initial={fromState}
          animate={inView ? toState : fromState}
          transition={{
            duration,
            delay: (index * delay) / 1000,
            ease: ease as Easing,
          }}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
};

// ==================================================================================
// SECTION 3: CRAFT.JS CONFIGURATION
// ==================================================================================
BlurText.craft = {
  displayName: "BlurText",
  props: {
    text: "Text that blurs in on scroll",
    fontSize: "24px",
    fontWeight: 500,
    textAlign: "center",
    margin: "0",
    animateBy: "words",
    duration: 0.5,
    delay: 100,
    ease: "easeOut",
    fromBlur: 8,
    fromOpacity: 0,
    fromY: 20,
    toBlur: 0,
    toOpacity: 1,
    toY: 0,
    threshold: 0.2,
    rootMargin: "0px",
  } satisfies BlurTextProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [{ key: "text", type: "textarea", label: "Text" }],
        },
        {
          label: "Typography",
          fields: [
            { key: "color", type: "color", label: "Color" },
            { key: "fontSize", type: "text", label: "Font Size" },
            { key: "fontWeight", type: "text", label: "Font Weight" },
            { key: "fontFamily", type: "text", label: "Font Family" },
            {
              key: "textAlign",
              type: "select",
              label: "Align",
              options: ["left", "center", "right"],
            },
          ],
        },
        {
          label: "Spacing",
          fields: [
            { key: "margin", type: "text", label: "Margin" },
            { key: "padding", type: "text", label: "Padding" },
          ],
        },
        {
          label: "Animation",
          fields: [
            {
              key: "animateBy",
              type: "select",
              label: "Animate By",
              options: ["words", "chars"],
            },
            {
              key: "duration",
              type: "number",
              label: "Duration (s)",
              step: 0.1,
            },
            { key: "delay", type: "number", label: "Stagger (ms)" },
            {
              key: "ease",
              type: "select",
              label: "Ease",
              options: [
                "linear",
                "easeIn",
                "easeOut",
                "easeInOut",
                "circIn",
                "circOut",
                "circInOut",
                "backIn",
                "backOut",
                "backInOut",
                "anticipate",
              ],
            },
          ],
        },
        {
          label: "From State (Start)",
          fields: [
            { key: "fromBlur", type: "number", label: "Blur (px)" },
            {
              key: "fromOpacity",
              type: "number",
              label: "Opacity",
              min: 0,
              max: 1,
              step: 0.1,
            },
            { key: "fromY", type: "number", label: "Y Offset (px)" },
          ],
        },
        {
          label: "To State (End)",
          fields: [
            { key: "toBlur", type: "number", label: "Blur (px)" },
            {
              key: "toOpacity",
              type: "number",
              label: "Opacity",
              min: 0,
              max: 1,
              step: 0.1,
            },
            { key: "toY", type: "number", label: "Y Offset (px)" },
          ],
        },
        {
          label: "Scroll Trigger",
          fields: [
            {
              key: "threshold",
              type: "number",
              label: "Activation Threshold",
              min: 0,
              max: 1,
              step: 0.1,
            },
            {
              key: "rootMargin",
              type: "text",
              label: "Trigger Margin (e.g., -100px)",
            },
          ],
        },
      ],
    },
  },
};
