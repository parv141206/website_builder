"use client";
import React, { useEffect, useRef, useState } from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";

// ==================================================================================
// SECTION 1: PROPS TYPE DEFINITION
// ==================================================================================
export type TextPressureProps = {
  text: string;
  fontFamily: string;
  fontUrl: string;

  // Effect Toggles
  enableWidth: boolean;
  enableWeight: boolean;
  enableItalic: boolean;
  enableAlpha: boolean;
  enableFlex: boolean;
  enableStroke: boolean;
  enableScale: boolean;

  // Styling
  textColor: string;
  strokeColor: string;
  minFontSize: number;
};

// ==================================================================================
// SECTION 2: THE CRAFT.JS COMPONENT
// ==================================================================================
export const TextPressure: React.FC<TextPressureProps> & { craft?: any } = ({
  text,
  fontFamily,
  fontUrl,
  enableWidth,
  enableWeight,
  enableItalic,
  enableAlpha,
  enableFlex,
  enableStroke,
  enableScale,
  textColor,
  strokeColor,
  minFontSize,
}) => {
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
  // ORIGINAL COMPONENT LOGIC (Hooks, State, Refs, Effects)
  // This is copied directly from the source component.
  // ----------------------------------------------------------------------------------
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split("");

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const setSize = () => {
      if (!containerRef.current || !titleRef.current) return;
      const { width: containerW, height: containerH } =
        containerRef.current.getBoundingClientRect();
      let newFontSize = containerW / (chars.length / 2);
      newFontSize = Math.max(newFontSize, minFontSize);
      setFontSize(newFontSize);
      setScaleY(1);
      setLineHeight(1);
      requestAnimationFrame(() => {
        if (!titleRef.current) return;
        const textRect = titleRef.current.getBoundingClientRect();
        if (enableScale && textRect.height > 0) {
          const yRatio = containerH / textRect.height;
          setScaleY(yRatio);
          setLineHeight(yRatio);
        }
      });
    };

    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [enableScale, text, chars.length, minFontSize]);

  useEffect(() => {
    let rafId: number;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;
      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;
        spansRef.current.forEach((span) => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };
          const d = dist(mouseRef.current, charCenter);
          const getAttr = (
            distance: number,
            minVal: number,
            maxVal: number,
          ) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };
          const wdth = enableWidth ? Math.floor(getAttr(d, 5, 200)) : 100;
          const wght = enableWeight ? Math.floor(getAttr(d, 100, 900)) : 400;
          const italVal = enableItalic ? getAttr(d, 0, 1).toFixed(2) : 0;
          const alphaVal = enableAlpha ? getAttr(d, 0, 1).toFixed(2) : 1;
          span.style.opacity = `${alphaVal}`;
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
        });
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(rafId);
  }, [enableWidth, enableWeight, enableItalic, enableAlpha]);

  const dynamicClassName = [
    enableFlex ? "custom-flex" : "",
    enableStroke ? "stroke" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ----------------------------------------------------------------------------------
  // JSX RETURN WITH CRAFT.JS INTEGRATION
  // ----------------------------------------------------------------------------------
  return (
    <div
      ref={(el: HTMLDivElement | null) => {
        // Connect both Craft.js ref and the component's internal ref
        if (el) {
          connect(drag(el));
          (
            containerRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = el;
        }
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        // Add editor-specific outline for better UX
        outline: selected ? "2px dashed #4c8bf5" : "none",
        outlineOffset: "2px",
      }}
    >
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }
        .custom-flex { display: flex; justify-content: space-between; }
        .stroke span { position: relative; color: ${textColor || theme.colors.text.heading}; }
        .stroke span::after {
          content: attr(data-char);
          position: absolute; left: 0; top: 0; z-index: -1;
          color: transparent;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }
        .text-pressure-title { color: ${textColor || theme.colors.text.heading}; }
      `}</style>

      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: "uppercase",
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          textAlign: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 100,
          width: "100%",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            style={{
              display: "inline-block",
              color: enableStroke
                ? undefined
                : textColor || theme.colors.text.heading,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    </div>
  );
};

// ==================================================================================
// SECTION 3: CRAFT.JS CONFIGURATION
// ==================================================================================
TextPressure.craft = {
  displayName: "TextPressure",
  props: {
    text: "Compress Me",
    fontFamily: "Compressa VF",
    fontUrl:
      "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2",
    enableWidth: true,
    enableWeight: true,
    enableItalic: true,
    enableAlpha: false,
    enableFlex: true,
    enableStroke: false,
    enableScale: false,
    textColor: "#ff0000",
    strokeColor: "#FFFFFF",
    minFontSize: 24,
  } satisfies TextPressureProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [
            { key: "text", type: "textarea", label: "Text" },
            { key: "fontFamily", type: "text", label: "Font Family Name" },
            { key: "fontUrl", type: "text", label: "Font URL (.woff2)" },
          ],
        },
        {
          label: "Effect Toggles",
          fields: [
            { key: "enableWidth", type: "boolean", label: "Width Effect" },
            { key: "enableWeight", type: "boolean", label: "Weight Effect" },
            { key: "enableItalic", type: "boolean", label: "Italic Effect" },
            { key: "enableAlpha", type: "boolean", label: "Opacity Effect" },
            { key: "enableFlex", type: "boolean", label: "Justify Spacing" },
            {
              key: "enableScale",
              type: "boolean",
              label: "Scale to Fit Height",
            },
          ],
        },
        {
          label: "Styling",
          fields: [
            { key: "textColor", type: "color", label: "Text Color" },
            { key: "enableStroke", type: "boolean", label: "Enable Stroke" },
            {
              key: "strokeColor",
              type: "color",
              label: "Stroke Color",
              if: (props: TextPressureProps) => props.enableStroke,
            },
            {
              key: "minFontSize",
              type: "number",
              label: "Min Font Size (px)",
            },
          ],
        },
      ],
    },
  },
};
