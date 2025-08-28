// src/components/core/craft/user-components/HeroSection1.tsx
"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { useTheme } from "~/themes";

// Import all primitive types and components
import { Container, type ContainerProps } from "../../../primitives/Container";
import { Text, type TextProps } from "../../../primitives/Typography/Text";
import { Button, type ButtonProps } from "../../../primitives/Button";
import {
  GradientBlinds,
  type GradientBlindsProps,
} from "../../../primitives/Backgrounds/GradientBlinds";
import {
  LightRays,
  type LightRaysProps,
} from "../../../primitives/Backgrounds/LightRays";
import { Orb, type OrbProps } from "../../../primitives/Orb";

export type HeroSection1Props = {
  mainTitle: string;
  subTitle: string;
  buttonText: string;
  buttonLink: string;
  spotlightContainerProps?: Partial<ContainerProps>;
  gradientBlindsProps?: Partial<GradientBlindsProps>;
  lightRaysProps?: Partial<LightRaysProps>;
  orb1Props?: Partial<OrbProps>;
  orb2Props?: Partial<OrbProps>;
  contentContainerProps?: Partial<ContainerProps>; // Using ContainerProps for content as well
  mainTitleProps?: Partial<TextProps>;
  subTitleProps?: Partial<TextProps>;
  buttonProps?: Partial<ButtonProps>;
};

export const HeroSection1: React.FC<HeroSection1Props> & { craft?: any } = ({
  mainTitle,
  subTitle,
  buttonText,
  buttonLink,
  spotlightContainerProps,
  gradientBlindsProps,
  lightRaysProps,
  orb1Props,
  orb2Props,
  contentContainerProps,
  mainTitleProps,
  subTitleProps,
  buttonProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const theme = useTheme();

  // --- Theme-based Defaults for HeroSection1 ---

  const defaultContainerProps: Partial<ContainerProps> = {
    minHeight: "700px", // Make it taller for impact
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 24px",
    backgroundColor: theme.colors.background.primary, // Base background color

    className: "relative w-full text-center overflow-hidden",
  };

  const defaultGradientBlindsProps: Partial<GradientBlindsProps> = {
    className: "absolute inset-0 z-0", // Behind everything
    gradientColors: [theme.colors.secondary, theme.colors.primary, "#000000"], // Use theme colors
    angle: 45,
    noise: 0.2,
    blindCount: 20,
    mouseDampening: 0.1,
    mixBlendMode: "overlay", // Blend with underlying elements
    height: "100%",
    width: "100%",
  };

  const defaultLightRaysProps: Partial<LightRaysProps> = {
    className: "absolute inset-0 z-10 opacity-70", // On top of blinds, below content
    raysOrigin: "top-center",
    raysColor: theme.colors.primary, // Use theme primary color
    raysSpeed: 0.5,
    lightSpread: 0.8,
    rayLength: 1.5,
    pulsating: true,
    fadeDistance: 0.7,
    saturation: 1.5, // Make it vibrant
    followMouse: true,
    mouseInfluence: 0.2,
    noiseAmount: 0.1,
    distortion: 0.1,
  };

  const defaultOrb1Props: Partial<OrbProps> = {
    width: "250px",
    height: "250px",
    position: "absolute",
    top: "10%",
    left: "15%",
    zIndex: "20", // Above background layers
    color1: theme.colors.primary,
    color2: theme.colors.secondary,
    color3: theme.colors.primary,
    hoverIntensity: 0.3,
    rotateOnHover: true,
    className: "hidden md:block blur-sm", // Hidden on small screens, slightly blurred
  };

  const defaultOrb2Props: Partial<OrbProps> = {
    width: "200px",
    height: "200px",
    position: "absolute",
    bottom: "10%",
    right: "10%",
    zIndex: "20",
    color1: theme.colors.primary,
    color2: theme.colors.text.muted,
    color3: theme.colors.text.body,
    hoverIntensity: 0.4,
    rotateOnHover: true,
    className: "hidden lg:block blur-md", // Hidden on medium/small screens, more blurred
  };

  const defaultContentContainerProps: Partial<ContainerProps> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "32px", // More space
    width: "100%",
    maxWidth: "5xl", // Wider content area
    zIndex: "30", // Ensure content is on top
    backgroundColor: "transparent", // Background handled by outer container
    className:
      "relative z-30 flex flex-col items-center justify-center text-white p-4 sm:p-8 md:p-12 space-y-8", // Tailwind classes for content layout, responsive padding
  };

  const defaultMainTitleProps: Partial<TextProps> = {
    as: "h1",
    fontSize: "6xl", // Bigger title
    fontWeight: "bold", // Even bolder
    lineHeight: "1",
    textAlign: "center",
    color: theme.colors.text.onPrimary, // White text for dark/fancy background
    className:
      "text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400 drop-shadow-lg", // Even fancier gradient
  };

  const defaultSubTitleProps: Partial<TextProps> = {
    as: "p",
    fontSize: "xl", // Bigger subtitle
    color: theme.colors.text.onPrimary, // White text
    lineHeight: "1.5",
    textAlign: "center",
    className: "max-w-3xl text-lg md:text-xl lg:text-2xl opacity-80", // Responsive font size, slightly transparent
  };

  const defaultButtonProps: Partial<ButtonProps> = {
    text: buttonText,
    href: buttonLink,
    className:
      "px-10 py-4 rounded-full text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-xl hover:from-teal-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95", // Very fancy button classes
  };

  return (
    <Element
      id="HeroSection1"
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      is={Container}
      {...defaultContainerProps}
      {...spotlightContainerProps}
    >
      {/* Background Layers (Z-index 0 and 10) */}
      <Element
        is={GradientBlinds}
        id="HeroSection1-gradient-blinds"
        {...defaultGradientBlindsProps}
        {...gradientBlindsProps}
      />

      {/* Decorative Orbs (Z-index 20) */}
      <Element
        is={Orb}
        id="HeroSection1-orb-1"
        {...defaultOrb1Props}
        {...orb1Props}
      />
      <Element
        is={Orb}
        id="HeroSection1-orb-2"
        {...defaultOrb2Props}
        {...orb2Props}
      />

      {/* Content Wrapper (Z-index 30) */}
      <Element
        is={Container} // Re-using Container for its layout and potential inner spotlight
        id="HeroSection1-content-wrapper"
        {...defaultContentContainerProps}
        {...contentContainerProps}
      >
        <Element
          is={Text}
          id="HeroSection1-main-title"
          text={mainTitle}
          {...defaultMainTitleProps}
          {...mainTitleProps}
        />

        <Element
          is={Text}
          id="HeroSection1-subtitle"
          text={subTitle}
          {...defaultSubTitleProps}
          {...subTitleProps}
        />

        <Element
          is={Button}
          id="HeroSection1-cta-button"
          text={buttonText}
          {...defaultButtonProps}
          {...buttonProps}
        />
      </Element>
    </Element>
  );
};

HeroSection1.craft = {
  displayName: "HeroSection1",
  props: {
    mainTitle: "The Future of Web Design is Here",
    subTitle:
      "Experience unparalleled creative freedom and build interactive, stunning web experiences with our advanced editor and powerful components.",
    buttonText: "Explore Features",
    buttonLink: "#features",
    // Empty objects to allow overrides in the editor
    spotlightContainerProps: {},
    gradientBlindsProps: {},
    lightRaysProps: {},
    orb1Props: {},
    orb2Props: {},
    contentContainerProps: {},
    mainTitleProps: {},
    subTitleProps: {},
    buttonProps: {},
  } satisfies HeroSection1Props,
  rules: {
    canDrag: () => true,
  },
  isCanvas: true,
};
