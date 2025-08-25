"use client";
import React from "react";
import { Container } from "./components/Container";
import { TextPressure } from "./components/TextPressure";
import { LightRays } from "./components/LightRays";

export default function Page() {
  return (
    <div className="mx-auto h-screen max-w-7xl">
      <Container
        backgroundType="color"
        patternOpacity={0.1}
        patternSize={20}
        height="100%"
        animation={{
          animationEnabled: false,
          animationType: "fadeIn",
          transitionDuration: 0.5,
          transitionDelay: 0,
          transitionEase: "easeInOut",
          slideInOffset: 50,
          slideInDirection: "up",
          scaleUpAmount: 0.9,
          animateOnce: true,
        }}
        id="ROOT"
        display="flex"
        flexDirection="column"
        gap="8px"
        padding="24px"
        width="100%"
        position="relative"
        top="auto"
        right="auto"
        bottom="auto"
        left="auto"
        zIndex="auto"
        minHeight="100vh"
      >
        <TextPressure
          text="New Text"
          fontFamily="Compressa VF"
          fontUrl="https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2"
          enableWidth={true}
          enableWeight={true}
          enableItalic={true}
          enableAlpha={false}
          enableFlex={true}
          enableStroke={false}
          enableScale={false}
          textColor="#ff0000"
          strokeColor="#FFFFFF"
          minFontSize={24}
        />
        <LightRays
          raysOrigin="top-center"
          raysColor="#0500ff"
          raysSpeed={1}
          lightSpread={1}
          rayLength={2}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className=""
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
        />
      </Container>
    </div>
  );
}
