"use client";
import React from "react";
import { Container } from "./components/Container";
import { GradientBlinds } from "./components/GradientBlinds";
import { TextPressure } from "./components/TextPressure";

export default function Page() {
  return (
    <Container
      backgroundType="color"
      patternOpacity={0.1}
      patternSize={20}
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
      background="#e9e4d9"
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
      justifyContent="center"
      alignItems="center"
    >
      <GradientBlinds
        className=""
        dpr={2}
        paused={false}
        gradientColors={["#FF9FFC", "#5227FF"]}
        angle={0}
        noise={0.3}
        blindCount={16}
        blindMinWidth={60}
        mouseDampening={0.15}
        mirrorGradient={false}
        spotlightRadius={0.5}
        spotlightSoftness={1}
        spotlightOpacity={1}
        distortAmount={0}
        shineDirection="left"
        mixBlendMode="lighten"
        height="100%"
        width="100%"
      />
      <Container
        display="flex"
        flexDirection="column"
        gap="8px"
        padding="16px"
        width="50%"
        backgroundType="color"
        backgroundColor="#00000000"
        patternOpacity={0.1}
        patternSize={20}
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
        position="relative"
        top="auto"
        right="auto"
        bottom="auto"
        left="auto"
        zIndex="auto"
        borderRadius="8px"
        minHeight="80px"
        alignItems="center"
        justifyContent="center"
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
          textColor="#ffffff"
          strokeColor="#FFFFFF"
          minFontSize={84}
        />
      </Container>
    </Container>
  );
}
