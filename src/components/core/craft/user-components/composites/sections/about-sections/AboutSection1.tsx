"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";

import { Container, type ContainerProps } from "../../../primitives/Container";
import { Text, type TextProps } from "../../../primitives/Typography/Text";
import { Animated, type AnimatedProps } from "../../../primitives/Animated";

export type AboutSection1Props = {
  title: string;
  description: string;
  features: string[];
  wrapperProps?: Partial<ContainerProps>;
  titleProps?: Partial<TextProps>;
  descriptionProps?: Partial<TextProps>;
  featureProps?: Partial<TextProps>;
  titleAnimProps?: Partial<AnimatedProps>;
  descriptionAnimProps?: Partial<AnimatedProps>;
  featureAnimProps?: Partial<AnimatedProps>;
  bgShape1AnimProps?: Partial<AnimatedProps>;
  bgShape2AnimProps?: Partial<AnimatedProps>;
};

export const AboutSection1: React.FC<AboutSection1Props> & { craft?: any } = ({
  title,
  description,
  features,
  wrapperProps,
  titleProps,
  descriptionProps,
  featureProps,
  titleAnimProps,
  descriptionAnimProps,
  featureAnimProps,
  bgShape1AnimProps,
  bgShape2AnimProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const theme = useTheme();

  /** Wrapper defaults */
  const defaultWrapperProps: Partial<ContainerProps> = {
    className:
      "relative flex flex-col items-center justify-center w-full min-h-screen gap-12 px-6 py-24 overflow-hidden " +
      "bg-gradient-to-br from-slate-950 via-slate-900 to-black",
  };

  /** Futuristic Background Shapes */
  const bgShape1Props: Partial<ContainerProps> = {
    className:
      "absolute top-[12%] left-[8%] w-[320px] h-[320px] rounded-full " +
      "bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.5),transparent_70%)] " +
      "blur-[90px] z-[1]",
  };

  const bgShape2Props: Partial<ContainerProps> = {
    className:
      "absolute bottom-[15%] right-[12%] w-[300px] h-[300px] rounded-full " +
      "bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.5),transparent_70%)] " +
      "blur-[90px] z-[1]",
  };

  /** Text defaults */
  const defaultTitleProps: Partial<TextProps> = {
    as: "h2",
    text: title,
    className:
      "text-4xl md:text-6xl font-extrabold leading-tight tracking-tight " +
      "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent z-10 " +
      "drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]",
  };

  const defaultDescriptionProps: Partial<TextProps> = {
    as: "p",
    text: description,
    className:
      "max-w-3xl mt-6 text-lg md:text-xl text-slate-300 leading-relaxed z-10 " +
      "drop-shadow-[0_0_6px_rgba(0,0,0,0.4)]",
  };

  const defaultFeatureProps: Partial<TextProps> = {
    as: "p",
    className:
      "text-base md:text-lg text-slate-200/90 leading-relaxed z-10 transition-transform " +
      "hover:scale-[1.02] hover:text-cyan-300",
  };

  /** Card wrapper */
  const defaultCardProps: Partial<ContainerProps> = {
    className:
      "flex flex-col md:flex-row gap-8 mt-12 p-8 rounded-2xl " +
      "bg-white/10 backdrop-blur-xl border border-white/20 " +
      "shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_0_20px_rgba(255,255,255,0.05)] z-5 " +
      "hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_0_28px_rgba(255,255,255,0.08)] transition-all duration-500",
  };

  /** Animation defaults */
  const defaultTitleAnim: Partial<AnimatedProps> = {
    variant: "slideUpFade",
    duration: 1000,
    delay: 200,
  };

  const defaultDescriptionAnim: Partial<AnimatedProps> = {
    variant: "fadeInScale",
    duration: 900,
    delay: 500,
  };

  const defaultFeatureAnim: Partial<AnimatedProps> = {
    variant: "staggerChildren",
    duration: 800,
    delay: 700,
  };

  const defaultBgAnim: Partial<AnimatedProps> = {
    variant: "floatSlow",
    duration: 6000,
    repeat: Infinity,
  };

  return (
    <Container
      ref={(ref) => ref && connect(drag(ref))}
      id="AboutSection1"
      {...defaultWrapperProps}
      {...wrapperProps}
    >
      {/* Futuristic Shapes */}
      <Animated
        id="AboutSection1-bg1-anim"
        {...defaultBgAnim}
        {...bgShape1AnimProps}
      >
        <Container id="AboutSection1-bg1" {...bgShape1Props} />
      </Animated>

      <Animated
        id="AboutSection1-bg2-anim"
        {...defaultBgAnim}
        {...bgShape2AnimProps}
      >
        <Container id="AboutSection1-bg2" {...bgShape2Props} />
      </Animated>

      {/* Title */}
      <Animated
        id="AboutSection1-title-anim"
        {...defaultTitleAnim}
        {...titleAnimProps}
      >
        <Text id="AboutSection1-title" {...defaultTitleProps} {...titleProps} />
      </Animated>

      {/* Underline accent */}
      <Animated
        id="AboutSection1-underline-anim"
        variant="widthReveal"
        duration={1200}
        delay={500}
      >
        <Container className="z-10 mt-3 h-[3px] w-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
      </Animated>

      {/* Description */}
      <Animated
        id="AboutSection1-description-anim"
        {...defaultDescriptionAnim}
        {...descriptionAnimProps}
      >
        <Text
          id="AboutSection1-description"
          {...defaultDescriptionProps}
          {...descriptionProps}
        />
      </Animated>

      {/* Features */}
      <Container id="AboutSection1-card" {...defaultCardProps}>
        {features.map((feature, idx) => (
          <Animated
            key={idx}
            id={`AboutSection1-feature-${idx}-anim`}
            variant="fadeInUp"
            duration={800}
            delay={800 + idx * 200}
            {...featureAnimProps}
          >
            <Text
              id={`AboutSection1-feature-${idx}`}
              {...defaultFeatureProps}
              {...featureProps}
              text={feature}
            />
          </Animated>
        ))}
      </Container>
    </Container>
  );
};

AboutSection1.craft = {
  displayName: "AboutSection1",
  props: {
    title: "About Our Mission",
    description:
      "We are building the future of design systems: sleek, modern, and infinitely customizable components that adapt to any workflow.",
    features: [
      "🚀 Motion-first architecture with buttery-smooth animations.",
      "🎨 Futuristic design with glowing gradients & shapes.",
      "🔧 Fully editable with drag-and-drop builder support.",
    ],
    wrapperProps: {},
    titleProps: {},
    descriptionProps: {},
    featureProps: {},
    titleAnimProps: {},
    descriptionAnimProps: {},
    featureAnimProps: {},
    bgShape1AnimProps: {},
    bgShape2AnimProps: {},
  } satisfies AboutSection1Props,
  rules: { canDrag: () => true },
  isCanvas: true,
};