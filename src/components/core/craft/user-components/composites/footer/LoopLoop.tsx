"use client";

import React, { useMemo } from "react";
import { useNode, Element } from "@craftjs/core";
import { SpotlightContainer } from "../../primitives/SpotlightContainer";
import { Image, type ImageProps } from "../../primitives/Image";

export type LogoLoopProps = {
  logos?: Array<Partial<ImageProps>>;
  speed?: number;
  direction?: "left" | "right";
  width?: string | number;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
};

const DEFAULT_LOGOS: Array<Partial<ImageProps>> = [
  { src: "https://picsum.photos/200/100", alt: "Logo 1" },
  { src: "https://picsum.photos/200/101", alt: "Logo 2" },
  { src: "https://picsum.photos/200/102", alt: "Logo 3" },
];

export const LogoLoop: React.FC<LogoLoopProps> & { craft?: unknown } = ({
  logos = DEFAULT_LOGOS,
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 28,
  gap = 32,
  pauseOnHover = true,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  ariaLabel = "Partner logos",
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const safeLogos =
    Array.isArray(logos) && logos.length > 0 ? logos : DEFAULT_LOGOS;

  const cssVariables = useMemo(
    () => ({
      "--logoloop-gap": `${gap}px`,
      "--logoloop-logoHeight": `${logoHeight}px`,
      ...(fadeOutColor ? { "--logoloop-fadeColor": fadeOutColor } : {}),
    }),
    [gap, logoHeight, fadeOutColor],
  );

  return (
    <SpotlightContainer
      ref={(ref: any) => { if (ref) connect(drag(ref)); }}
      display="flex"
      alignItems="center"
      overflow="hidden"
      position="relative"
      width={typeof width === "number" ? `${width}px` : width}
      style={cssVariables}
      role="region"
      aria-label={ariaLabel}
    >
      <SpotlightContainer
        display="flex"
        style={{
          whiteSpace: "nowrap",
          gap: `${gap}px`,
          animation: `${direction === "left" ? "scrollLeft" : "scrollRight"} ${
            Math.abs(speed) / 10
          }s linear infinite`,
        }}
      >
        {safeLogos.map((logo, index) => (
          <Element
            key={index}
            is={Image}
            id={`LogoLoop-logo-${index}`}
            src={logo.src ?? ""}
            alt={logo.alt ?? `Logo ${index + 1}`}
            style={{
              height: "var(--logoloop-logoHeight)",
              width: "auto",
              objectFit: "contain",
              ...(scaleOnHover && { transition: "transform 0.3s ease" }),
            }}
            {...logo}
          />
        ))}
      </SpotlightContainer>

      {fadeOut && (
        <>
          <SpotlightContainer
            aria-hidden="true"
            position="absolute"
            top="0"
            bottom="0"
            left="0"
            width="120px"
            style={{
              pointerEvents: "none",
              background: `linear-gradient(to right, ${
                fadeOutColor ?? "white"
              } 0%, transparent 100%)`,
            }}
          />
          <SpotlightContainer
            aria-hidden="true"
            position="absolute"
            top="0"
            bottom="0"
            right="0"
            width="120px"
            style={{
              pointerEvents: "none",
              background: `linear-gradient(to left, ${
                fadeOutColor ?? "white"
              } 0%, transparent 100%)`,
            }}
          />
        </>
      )}
    </SpotlightContainer>
  );
};

LogoLoop.craft = {
  displayName: "Logo Loop",
  props: {
    logos: DEFAULT_LOGOS,
    speed: 120,
    direction: "left",
    width: "100%",
    logoHeight: 28,
    gap: 32,
    pauseOnHover: true,
    fadeOut: false,
    fadeOutColor: "#ffffff",
    scaleOnHover: false,
    ariaLabel: "Partner logos",
  },
  rules: {
    canDrag: () => true,
  },
};
