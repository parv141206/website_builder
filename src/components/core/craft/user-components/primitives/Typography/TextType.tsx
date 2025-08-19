"use client";
import React, {
  ElementType,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNode } from "@craftjs/core";
import { useTheme } from "~/themes";
import { gsap } from "gsap";

// ==================================================================================
// SECTION 1: PROPS TYPE DEFINITION
// ==================================================================================
export type TextTypeProps = {
  // Content
  text: string; // Will be a newline-separated string from the textarea
  textColors: string; // Will be a comma-separated string from the text input

  // Styling & Layout
  as?: ElementType;
  fontSize?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  margin?: string;

  // Animation Timing
  typingSpeed: number;
  deletingSpeed: number;
  pauseDuration: number;
  initialDelay: number;
  loop: boolean;

  // Animation Behavior
  useVariableSpeed: boolean;
  variableSpeedMin: number;
  variableSpeedMax: number;
  reverseMode: boolean;
  startOnVisible: boolean;

  // Cursor Settings
  showCursor: boolean;
  hideCursorWhileTyping: boolean;
  cursorCharacter: string;
  cursorBlinkDuration: number;
};

// ==================================================================================
// SECTION 2: THE CRAFT.JS COMPONENT
// ==================================================================================
export const TextType: React.FC<TextTypeProps> & { craft?: any } = (props) => {
  const { as: Component = "div", text, textColors, ...rest } = props;

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
  // COMPONENT LOGIC (Adapted from original)
  // ----------------------------------------------------------------------------------
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!props.startOnVisible);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Process props from settings panel into arrays/objects the logic can use
  const textArray = useMemo(
    () => text.split("\n").filter((line) => line.trim() !== ""),
    [text],
  );
  const colorsArray = useMemo(
    () =>
      textColors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    [textColors],
  );

  const getRandomSpeed = useCallback(() => {
    if (!props.useVariableSpeed) return props.typingSpeed;
    return (
      Math.random() * (props.variableSpeedMax - props.variableSpeedMin) +
      props.variableSpeedMin
    );
  }, [
    props.useVariableSpeed,
    props.variableSpeedMin,
    props.variableSpeedMax,
    props.typingSpeed,
  ]);

  const getCurrentTextColor = () => {
    if (colorsArray.length === 0) return props.color || theme.colors.text.body;
    return colorsArray[currentTextIndex % colorsArray.length];
  };

  useEffect(() => {
    if (!props.startOnVisible || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [props.startOnVisible]);

  useEffect(() => {
    if (props.showCursor && cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: props.cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }
  }, [props.showCursor, props.cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible || textArray.length === 0) return;
    let timeout: NodeJS.Timeout;
    const currentText = textArray[currentTextIndex];
    const processedText = props.reverseMode
      ? currentText.split("").reverse().join("")
      : currentText;

    const executeTyping = () => {
      if (isDeleting) {
        if (displayedText === "") {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !props.loop) return;
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, props.deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev + processedText[currentCharIndex]);
            setCurrentCharIndex((prev) => prev + 1);
          }, getRandomSpeed());
        } else {
          timeout = setTimeout(() => setIsDeleting(true), props.pauseDuration);
        }
      }
    };

    // Initial delay logic
    if (currentCharIndex === 0 && !isDeleting && displayedText === "") {
      timeout = setTimeout(executeTyping, props.initialDelay);
    } else {
      executeTyping();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    textArray,
    currentTextIndex,
    isVisible,
    props,
    getRandomSpeed,
  ]);

  const shouldHideCursor =
    props.hideCursorWhileTyping &&
    (currentCharIndex < textArray[currentTextIndex]?.length || isDeleting);

  return (
    <Component
      ref={(el: HTMLElement | null) => {
        if (el) {
          connect(drag(el));
          (containerRef as React.MutableRefObject<HTMLElement | null>).current =
            el;
        }
      }}
      style={{
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        fontFamily: props.fontFamily || theme.fonts.body,
        textAlign: props.textAlign,
        margin: props.margin,
        position: "relative", // For cursor positioning
        outline: selected ? "2px dashed #4c8bf5" : "none",
        outlineOffset: "2px",
      }}
    >
      <style>{`
          .text-type__cursor {
              opacity: 1;
              display: inline-block;
              margin-left: 2px;
          }
          .text-type__cursor--hidden {
              opacity: 0 !important;
          }
      `}</style>
      <span style={{ color: getCurrentTextColor() }}>{displayedText}</span>
      {props.showCursor && (
        <span
          ref={cursorRef}
          className={`text-type__cursor ${shouldHideCursor ? "text-type__cursor--hidden" : ""}`}
          style={{ color: getCurrentTextColor() }}
        >
          {props.cursorCharacter}
        </span>
      )}
    </Component>
  );
};

// ==================================================================================
// SECTION 3: CRAFT.JS CONFIGURATION
// ==================================================================================
TextType.craft = {
  displayName: "TextType",
  props: {
    text: "This is the first sentence.\nThis is the second one.",
    as: "h2",
    fontSize: "32px",
    fontWeight: 700,
    textAlign: "left",
    margin: "0",
    textColors: "#FFFFFF, #888888",
    typingSpeed: 50,
    deletingSpeed: 30,
    pauseDuration: 2000,
    initialDelay: 500,
    loop: true,
    useVariableSpeed: false,
    variableSpeedMin: 40,
    variableSpeedMax: 100,
    reverseMode: false,
    startOnVisible: true,
    showCursor: true,
    hideCursorWhileTyping: false,
    cursorCharacter: "|",
    cursorBlinkDuration: 0.5,
  } satisfies TextTypeProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [
            {
              key: "text",
              type: "textarea",
              label: "Text (One sentence per line)",
            },
            {
              key: "textColors",
              type: "text",
              label: "Colors (Comma-separated)",
            },
            {
              key: "as",
              type: "select",
              label: "HTML Tag",
              options: ["p", "h1", "h2", "h3", "h4", "div"],
            },
          ],
        },
        {
          label: "Typography & Spacing",
          fields: [
            { key: "fontSize", type: "text", label: "Font Size" },
            { key: "fontWeight", type: "text", label: "Font Weight" },
            { key: "fontFamily", type: "text", label: "Font Family" },
            {
              key: "textAlign",
              type: "select",
              label: "Align",
              options: ["left", "center", "right"],
            },
            { key: "margin", type: "text", label: "Margin" },
          ],
        },
        {
          label: "Animation",
          fields: [
            { key: "typingSpeed", type: "number", label: "Typing Speed (ms)" },
            {
              key: "deletingSpeed",
              type: "number",
              label: "Deleting Speed (ms)",
            },
            { key: "pauseDuration", type: "number", label: "Pause (ms)" },
            {
              key: "initialDelay",
              type: "number",
              label: "Initial Delay (ms)",
            },
            { key: "loop", type: "boolean", label: "Loop Animation" },
            { key: "reverseMode", type: "boolean", label: "Reverse Mode" },
            {
              key: "startOnVisible",
              type: "boolean",
              label: "Start When Visible",
            },
          ],
        },
        {
          label: "Variable Speed",
          fields: [
            {
              key: "useVariableSpeed",
              type: "boolean",
              label: "Use Variable Speed",
            },
            {
              key: "variableSpeedMin",
              type: "number",
              label: "Min Speed (ms)",
              if: (props: TextTypeProps) => props.useVariableSpeed,
            },
            {
              key: "variableSpeedMax",
              type: "number",
              label: "Max Speed (ms)",
              if: (props: TextTypeProps) => props.useVariableSpeed,
            },
          ],
        },
        {
          label: "Cursor",
          fields: [
            { key: "showCursor", type: "boolean", label: "Show Cursor" },
            {
              key: "cursorCharacter",
              type: "text",
              label: "Cursor Character",
              if: (props: TextTypeProps) => props.showCursor,
            },
            {
              key: "cursorBlinkDuration",
              type: "number",
              label: "Blink Speed (s)",
              step: 0.1,
              if: (props: TextTypeProps) => props.showCursor,
            },
            {
              key: "hideCursorWhileTyping",
              type: "boolean",
              label: "Hide While Typing",
              if: (props: TextTypeProps) => props.showCursor,
            },
          ],
        },
      ],
    },
  },
};
