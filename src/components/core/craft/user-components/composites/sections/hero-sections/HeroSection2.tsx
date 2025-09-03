"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";

import { Container, type ContainerProps } from "../../../primitives/Container";
import { Text, type TextProps } from "../../../primitives/Typography/Text";
import { Button, type ButtonProps } from "../../../primitives/Button";
import { Animated, type AnimatedProps } from "../../../primitives/Animated";

export type HeroSection2Props = {
  mainTitle: string;
  subTitle: string;
  buttonText: string;
  buttonLink: string;
  wrapperProps?: Partial<ContainerProps>;
  mainTitleProps?: Partial<TextProps>;
  subTitleProps?: Partial<TextProps>;
  buttonProps?: Partial<ButtonProps>;
  titleAnimProps?: Partial<AnimatedProps>;
  subtitleAnimProps?: Partial<AnimatedProps>;
  buttonAnimProps?: Partial<AnimatedProps>;
  bgShape1AnimProps?: Partial<AnimatedProps>;
  bgShape2AnimProps?: Partial<AnimatedProps>;
};

export const HeroSection2: React.FC<HeroSection2Props> & { craft?: any } = ({
  mainTitle,
  subTitle,
  buttonText,
  buttonLink,
  wrapperProps,
  mainTitleProps,
  subTitleProps,
  buttonProps,
  titleAnimProps,
  subtitleAnimProps,
  buttonAnimProps,
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
      "relative flex flex-col items-center justify-center min-h-screen w-full text-center gap-10 px-6 py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
  };

  /** Futuristic Background Shapes */
  const bgShape1Props: Partial<ContainerProps> = {
    className:
      "absolute top-[12%] left-[10%] w-[380px] h-[380px] rounded-full " +
      "bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.6),transparent_70%)] " +
      "blur-[60px] z-[1]",
  };

  const bgShape2Props: Partial<ContainerProps> = {
    className:
      "absolute bottom-[15%] right-[12%] w-[300px] h-[300px] rounded-full " +
      "bg-[radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.6),transparent_70%)] " +
      "blur-[60px] z-[1]",
  };

  /** Text + Button defaults */
  const defaultMainTitleProps: Partial<TextProps> = {
    as: "h1",
    text: mainTitle,
    className:
      "text-5xl md:text-7xl font-extrabold leading-tight " +
      "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent z-10",
  };

  const defaultSubTitleProps: Partial<TextProps> = {
    as: "p",
    text: subTitle,
    className:
      "mt-6 max-w-2xl text-lg md:text-xl text-slate-300 leading-relaxed z-10",
  };

  const defaultButtonProps: Partial<ButtonProps> = {
    text: buttonText,
    href: buttonLink,
    className:
      "mt-10 px-8 py-3 rounded-full text-lg font-semibold text-white " +
      "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg " +
      "hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] transition-all duration-300 z-10",
  };

  /** Glassmorphic card defaults */
  const defaultCardProps: Partial<ContainerProps> = {
    className:
      "flex flex-row gap-6 mt-16 p-7 rounded-2xl " +
      "bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_6px_28px_rgba(0,0,0,0.25),inset_0_0_18px_rgba(255,255,255,0.05)] z-5",
  };

  const defaultCardTextProps: Partial<TextProps> = {
    as: "p",
    className:
      "text-sm md:text-base text-white/90 leading-relaxed max-w-xs text-left",
  };

  /** Animation defaults */
  const defaultTitleAnim: Partial<AnimatedProps> = {
    variant: "shimmerText",
    duration: 6000,
    repeat: Infinity,
  };

  const defaultSubtitleAnim: Partial<AnimatedProps> = {
    variant: "fadeUp",
    duration: 800,
    delay: 300,
  };

  const defaultButtonAnim: Partial<AnimatedProps> = {
    variant: "fadeUp",
    duration: 800,
    delay: 600,
  };

  const defaultBgAnim: Partial<AnimatedProps> = {
    variant: "float",
    duration: 5000,
    repeat: Infinity,
  };

  return (
    <Container
      ref={(ref) => ref && connect(drag(ref))}
      id="HeroSection2"
      {...defaultWrapperProps}
      {...wrapperProps}
    >
      {/* Futuristic Shapes */}
      <Animated
        id="HeroSection2-bgShape1-anim"
        {...defaultBgAnim}
        {...bgShape1AnimProps}
      >
        <Container id="HeroSection2-bgShape1" {...bgShape1Props} />
      </Animated>

      <Animated
        id="HeroSection2-bgShape2-anim"
        {...defaultBgAnim}
        {...bgShape2AnimProps}
      >
        <Container id="HeroSection2-bgShape2" {...bgShape2Props} />
      </Animated>

      {/* Title */}
      <Animated
        id="HeroSection2-title-anim"
        {...defaultTitleAnim}
        {...titleAnimProps}
      >
        <Text
          id="HeroSection2-title"
          {...defaultMainTitleProps}
          {...mainTitleProps}
        />
      </Animated>

      {/* Subtitle */}
      <Animated
        id="HeroSection2-subtitle-anim"
        {...defaultSubtitleAnim}
        {...subtitleAnimProps}
      >
        <Text
          id="HeroSection2-subtitle"
          {...defaultSubTitleProps}
          {...subTitleProps}
        />
      </Animated>

      {/* Button */}
      <Animated
        id="HeroSection2-button-anim"
        {...defaultButtonAnim}
        {...buttonAnimProps}
      >
        <Button
          id="HeroSection2-button"
          {...defaultButtonProps}
          {...buttonProps}
        />
      </Animated>

      {/* Glassmorphic Content Cards */}
      <Container id="HeroSection2-cards" {...defaultCardProps}>
        <Text
          id="HeroSection2-card1"
          {...defaultCardTextProps}
          text="✨ Fully customizable hero sections with gradients and animations."
        />
        <Text
          id="HeroSection2-card2"
          {...defaultCardTextProps}
          text="🎨 Futuristic glowing shapes replace orbs for a sleek vibe."
        />
        <Text
          id="HeroSection2-card3"
          {...defaultCardTextProps}
          text="⚡ Editable components with motion support for dynamic layouts."
        />
      </Container>
    </Container>
  );
};

HeroSection2.craft = {
  displayName: "HeroSection2",
  props: {
    mainTitle: "Build Without Limits",
    subTitle:
      "Create sleek, modern hero sections with bold editable headings and immersive futuristic design.",
    buttonText: "Get Started",
    buttonLink: "#start",
    wrapperProps: {},
    mainTitleProps: {},
    subTitleProps: {},
    buttonProps: {},
    titleAnimProps: {},
    subtitleAnimProps: {},
    buttonAnimProps: {},
    bgShape1AnimProps: {},
    bgShape2AnimProps: {},
  } satisfies HeroSection2Props,
  rules: { canDrag: () => true },
  isCanvas: true,
};
