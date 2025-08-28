"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";
import { Animated } from "../../primitives/Animated";

interface FormCardProps {
  title?: string;
  subtitle?: string;
  theme?: "light" | "dark";
  containerProps?: Partial<ContainerProps>;
  textProps?: Partial<TextProps>;
}

export const FormCard = ({
  title = "Welcome back",
  subtitle = "Sign in to continue",
  theme = "light",
  containerProps,
  textProps,
}: FormCardProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  // Themes
  const themeStyles = {
    light: {
      background: "#f3f4f6",
      cardBackground: "#ffffff",
      textColor: "#111827",
      subText: "#6b7280",
      border: "#e5e7eb",
      inputBg: "#f9fafb",
      hoverBorder: "#d1d5db",
    },
    dark: {
      background: "#0f172a",
      cardBackground: "#1e293b",
      textColor: "#f9fafb",
      subText: "#94a3b8",
      border: "#334155",
      inputBg: "#0f172a",
      hoverBorder: "#475569",
    },
  };

  const currentTheme = themeStyles[theme];

  const buttonStyle = {
    width: "100%",
    height: "42px",
    borderRadius: "6px",
    border: `1px solid ${currentTheme.border}`,
    backgroundColor: currentTheme.cardBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    color: currentTheme.textColor,
    gap: "6px",
    transition: "all 0.2s ease",
  };

  const inputStyle = {
    width: "100%",
    height: "42px",
    borderRadius: "6px",
    border: `1px solid ${currentTheme.border}`,
    backgroundColor: currentTheme.inputBg,
    fontSize: "14px",
    fontWeight: 500,
    color: currentTheme.textColor,
    padding: "0 12px",
    outline: "none" as const,
    transition: "all 0.2s ease",
  };

  return (
    <Container
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      padding="24px"
      borderRadius="12px"
      boxShadow="0 4px 12px rgba(0,0,0,0.06)"
      background={currentTheme.cardBackground}
      width="100%"
      maxWidth="320px"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      style={{
        border: `1px solid ${currentTheme.border}`, // ✅ enforce inline border
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${currentTheme.hoverBorder}`;
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `1px solid ${currentTheme.border}`;
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
      }}
      {...containerProps}
    >
      {/* Title */}
      <Element
        is={Text}
        id="form-title"
        text={title}
        fontSize="18px"
        fontWeight="700"
        color={currentTheme.textColor}
        textAlign="center"
        margin="0 0 8px 0"
        {...textProps}
      />
      <Text
        text={subtitle}
        fontSize="13px"
        fontWeight="500"
        color={currentTheme.subText}
        textAlign="center"
        margin="0 0 16px 0"
      />

      {/* Google Button */}
      <Animated style={buttonStyle} whileHover={{ scale: 1.02 }}>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          style={{ width: "16px", height: "16px" }}
        />
        <Text text="Continue with Google" />
      </Animated>

      {/* GitHub Button */}
      <Animated
        style={{ ...buttonStyle, margin: "8px 0 0 0" }}
        whileHover={{ scale: 1.02 }}
      >
        <img
          src="https://www.svgrepo.com/show/512317/github-142.svg"
          alt="Github"
          style={{ width: "16px", height: "16px" }}
        />
        <Text text="Continue with GitHub" />
      </Animated>

      {/* Separator */}
      <Container
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="6px"
        margin="16px 0"
      >
        <Container
          flex="1"
          height="1px"
          backgroundColor={currentTheme.border}
        />
        <Text text="or" color={currentTheme.subText} fontWeight="500" />
        <Container
          flex="1"
          height="1px"
          backgroundColor={currentTheme.border}
        />
      </Container>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        style={{ ...inputStyle, marginBottom: "12px" }}
        onFocus={(e) =>
          (e.currentTarget.style.border = `1px solid ${
            theme === "light" ? "#2563eb" : "#3b82f6"
          }`)
        }
        onBlur={(e) =>
          (e.currentTarget.style.border = `1px solid ${currentTheme.border}`)
        }
      />

      {/* Continue Button */}
      <Animated
        style={{
          ...buttonStyle,
          backgroundColor: theme === "light" ? "#2563eb" : "#3b82f6",
          color: "#ffffff",
          border: "none",
        }}
        whileHover={{ scale: 1.02 }}
      >
        <Text text="Continue →" />
      </Animated>
    </Container>
  );
};

FormCard.craft = {
  displayName: "Form Card",
  props: {
    title: "Welcome back",
    subtitle: "Sign in to continue",
    theme: "light",
    containerProps: {},
    textProps: {},
  },
  rules: {
    canDrag: () => true,
  },
};
