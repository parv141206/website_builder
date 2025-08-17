"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

export type FlipCardProps = {
  frontTitle: string;
  frontText: string;
  backTitle: string;
  backText: string;

  frontContainerProps?: Partial<ContainerProps>;
  backContainerProps?: Partial<ContainerProps>;
  frontTitleProps?: Partial<TextProps>;
  frontTextProps?: Partial<TextProps>;
  backTitleProps?: Partial<TextProps>;
  backTextProps?: Partial<TextProps>;
};

export const FlipCard: React.FC<FlipCardProps> & { craft?: any } = ({
  frontTitle,
  frontText,
  backTitle,
  backText,
  frontContainerProps,
  backContainerProps,
  frontTitleProps,
  frontTextProps,
  backTitleProps,
  backTextProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Mount only on client to avoid SSR hydration mismatch
  useEffect(() => setMounted(true), []);

  // ✅ Connect drag & drop after mount
  useEffect(() => {
    if (wrapperRef.current) connect(drag(wrapperRef.current));
  }, [connect, drag]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative h-80 w-64 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className="relative h-full w-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side */}
        <Element
          is={Container}
          canvas
          id="FlipCard-front"
          padding="16px"
          borderRadius="12px"
          backgroundColor="#1f2937"
          color="white"
          boxShadow="0 4px 10px rgba(0,0,0,0.2)"
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
          {...frontContainerProps}
        >
          <Element
            is={Text}
            id="FlipCard-frontTitle"
            text={frontTitle}
            as="h3"
            fontSize="18px"
            fontWeight="bold"
            margin="0 0 8px 0"
            {...frontTitleProps}
          />
          <Element
            is={Text}
            id="FlipCard-frontText"
            text={frontText}
            as="p"
            fontSize="14px"
            {...frontTextProps}
          />
        </Element>

        {/* Back Side */}
        <Element
          is={Container}
          canvas
          id="FlipCard-back"
          padding="16px"
          borderRadius="12px"
          backgroundColor="linear-gradient(to right, #6366f1, #9333ea)"
          color="white"
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          {...backContainerProps}
        >
          <Element
            is={Text}
            id="FlipCard-backTitle"
            text={backTitle}
            as="h3"
            fontSize="18px"
            fontWeight="bold"
            margin="0 0 8px 0"
            {...backTitleProps}
          />
          <Element
            is={Text}
            id="FlipCard-backText"
            text={backText}
            as="p"
            fontSize="14px"
            {...backTextProps}
          />
        </Element>
      </div>
    </div>
  );
};

// ✅ Craft.js editor config
FlipCard.craft = {
  displayName: "Flip Card",
  props: {
    frontTitle: "Front Side",
    frontText: "Click to flip this sleek card.",
    backTitle: "Back Side",
    backText: "Here’s the back content!",
    frontContainerProps: {},
    backContainerProps: {},
    frontTitleProps: {},
    frontTextProps: {},
    backTitleProps: {},
    backTextProps: {},
  },
  rules: { canDrag: () => true },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Front",
          fields: [
            { key: "frontTitle", type: "text", label: "Front Title" },
            { key: "frontText", type: "textarea", label: "Front Text" },
          ],
        },
        {
          label: "Back",
          fields: [
            { key: "backTitle", type: "text", label: "Back Title" },
            { key: "backText", type: "textarea", label: "Back Text" },
          ],
        },
      ],
    },
  },
};
