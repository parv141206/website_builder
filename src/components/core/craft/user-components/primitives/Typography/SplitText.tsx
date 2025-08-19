"use client";
import React, { useRef, useEffect, useMemo } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

// Register GSAP plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, GSAPSplitText);
}

// ==================================================================================
// SECTION 1: PROPS TYPE DEFINITION
// ==================================================================================
export type SplitTextProps = {
  text: string;
  textAlign?: "left" | "center" | "right" | "justify";

  // Typography & Styling
  color?: string;
  fontSize?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  letterSpacing?: string;
  lineHeight?: string;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";

  // Spacing
  margin?: string;
  padding?: string;

  // Animation Settings
  splitType: "chars" | "words" | "lines";
  duration: number;
  delay: number; // Stagger delay in ms
  ease: string;

  // 'From' State
  fromOpacity: number;
  fromY: number;
  fromX: number;
  fromScale: number;
  fromRotation: number;

  // 'To' State
  toOpacity: number;
  toY: number;
  toX: number;
  toScale: number;
  toRotation: number;

  // ScrollTrigger Settings
  threshold: number;
  rootMargin: string;
};

// ==================================================================================
// SECTION 2: THE CRAFT.JS COMPONENT
// ==================================================================================
export const SplitText: React.FC<SplitTextProps> & { craft?: any } = (
  props,
) => {
  const {
    text,
    textAlign,
    splitType,
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
  // COMPONENT LOGIC
  // ----------------------------------------------------------------------------------
  const gsRef = useRef<HTMLParagraphElement>(null);

  const from = useMemo(
    () => ({
      opacity: props.fromOpacity,
      y: props.fromY,
      x: props.fromX,
      scale: props.fromScale,
      rotation: props.fromRotation,
    }),
    [
      props.fromOpacity,
      props.fromY,
      props.fromX,
      props.fromScale,
      props.fromRotation,
    ],
  );

  const to = useMemo(
    () => ({
      opacity: props.toOpacity,
      y: props.toY,
      x: props.toX,
      scale: props.toScale,
      rotation: props.toRotation,
    }),
    [props.toOpacity, props.toY, props.toX, props.toScale, props.toRotation],
  );

  useEffect(() => {
    if (!gsRef.current || !text) return;
    const el = gsRef.current;

    const splitter = new GSAPSplitText(el, {
      type: splitType,
      linesClass: "split-line",
    });
    let targets =
      splitType === "lines"
        ? splitter.lines
        : splitType === "words"
          ? splitter.words
          : splitter.chars;

    if (!targets || targets.length === 0) {
      splitter.revert();
      return;
    }

    const startPct = (1 - threshold) * 100;
    const start = `top ${startPct}%${rootMargin ? `+=${rootMargin}` : ""}`;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
        once: true,
      },
    });
    tl.fromTo(
      targets,
      { ...from },
      { ...to, duration, ease, stagger: delay / 1000 },
    );

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
      if (splitter) splitter.revert();
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin]);

  // ----------------------------------------------------------------------------------
  // JSX RETURN
  // ----------------------------------------------------------------------------------
  return (
    <p
      ref={(el: HTMLParagraphElement | null) => {
        if (el) {
          connect(drag(el));
          gsRef.current = el;
        }
      }}
      style={{
        // Apply all the new styling props
        textAlign,
        color: props.color || theme.colors.text.body,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        fontFamily: props.fontFamily || theme.fonts.body,
        letterSpacing: props.letterSpacing,
        lineHeight: props.lineHeight,
        textTransform: props.textTransform,
        margin: props.margin,
        padding: props.padding,
        // Editor-specific outline for better UX
        outline: selected ? "2px dashed #4c8bf5" : "none",
        outlineOffset: "2px",
      }}
    >
      {text}
    </p>
  );
};

// ==================================================================================
// SECTION 3: CRAFT.JS CONFIGURATION
// ==================================================================================
SplitText.craft = {
  displayName: "SplitText",
  props: {
    text: "Animated Text on Scroll",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: 400,
    margin: "0",
    splitType: "chars",
    duration: 0.8,
    delay: 30,
    ease: "power3.out",
    fromOpacity: 0,
    fromY: 50,
    fromX: 0,
    fromScale: 1,
    fromRotation: 0,
    toOpacity: 1,
    toY: 0,
    toX: 0,
    toScale: 1,
    toRotation: 0,
    threshold: 0.2,
    rootMargin: "-100px",
  } satisfies SplitTextProps,
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
              options: ["left", "center", "right", "justify"],
            },
            { key: "lineHeight", type: "text", label: "Line Height" },
            { key: "letterSpacing", type: "text", label: "Letter Spacing" },
            {
              key: "textTransform",
              type: "select",
              label: "Transform",
              options: ["none", "uppercase", "lowercase", "capitalize"],
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
              key: "splitType",
              type: "select",
              label: "Split By",
              options: ["chars", "words", "lines"],
            },
            {
              key: "duration",
              type: "number",
              label: "Duration (s)",
              step: 0.1,
            },
            { key: "delay", type: "number", label: "Stagger (ms)" },
            { key: "ease", type: "text", label: "Ease Function" },
          ],
        },
        {
          label: "From State (Start)",
          fields: [
            {
              key: "fromOpacity",
              type: "number",
              label: "Opacity",
              min: 0,
              max: 1,
              step: 0.1,
            },
            { key: "fromY", type: "number", label: "Y Offset (px)" },
            { key: "fromX", type: "number", label: "X Offset (px)" },
            { key: "fromScale", type: "number", label: "Scale", step: 0.1 },
            { key: "fromRotation", type: "number", label: "Rotation (°)" },
          ],
        },
        {
          label: "To State (End)",
          fields: [
            {
              key: "toOpacity",
              type: "number",
              label: "Opacity",
              min: 0,
              max: 1,
              step: 0.1,
            },
            { key: "toY", type: "number", label: "Y Offset (px)" },
            { key: "toX", type: "number", label: "X Offset (px)" },
            { key: "toScale", type: "number", label: "Scale", step: 0.1 },
            { key: "toRotation", type: "number", label: "Rotation (°)" },
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
