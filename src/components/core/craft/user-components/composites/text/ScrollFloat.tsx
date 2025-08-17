"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ScrollFloatProps = {
  text: string;
  containerProps?: Partial<ContainerProps>;
  textProps?: Partial<TextProps>;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
};

export const ScrollFloat: React.FC<ScrollFloatProps> & { craft?: any } = ({
  text,
  containerProps,
  textProps,
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="scroll-float-char"
        style={{ display: "inline-block", willChange: "opacity, transform" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, [text]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars =
      containerRef.current.querySelectorAll<HTMLSpanElement>(
        ".scroll-float-char",
      );

    gsap.fromTo(
      chars,
      {
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: "50% 0%",
      },
      {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        duration: animationDuration,
        ease: ease,
        scrollTrigger: {
          trigger: containerRef.current,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      },
    );
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger]);

  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Container
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      {...containerProps}
    >
      <Element
        is={Text}
        id="ScrollFloat-text"
        ref={containerRef}
        {...textProps}
      >
        {splitText}
      </Element>
    </Container>
  );
};

ScrollFloat.craft = {
  displayName: "Scroll Float",
  props: {
    text: "React Bits",
    containerProps: {},
    textProps: {},
    animationDuration: 1,
    ease: "back.inOut(2)",
    scrollStart: "center bottom+=50%",
    scrollEnd: "bottom bottom-=40%",
    stagger: 0.03,
  },
  rules: { canDrag: () => true },
};
