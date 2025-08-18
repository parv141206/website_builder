"use client";

import React, {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
  type ForwardedRef,
} from "react";
import { useNode, Element } from "@craftjs/core";
import { AnimatePresence, type Transition, type Variants } from "motion/react";

import { Animated } from "../../primitives/Animated";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Text";

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export type RotatingTextProps = {
  texts: string[];
  transition?: Transition;
  initial?: Variants["initial"];
  animate?: Variants["animate"];
  exit?: Variants["exit"];
  animatePresenceMode?: "wait" | "sync" | "popLayout";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (newIndex: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  containerProps?: Partial<ContainerProps>;
  textProps?: Partial<TextProps>;
};

export type RotatingTextRef = {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
};

export const RotatingText: React.FC<RotatingTextProps> & { craft?: unknown } =
  forwardRef((props, ref: ForwardedRef<RotatingTextRef>) => {
    const {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0.025,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      containerProps,
      textProps,
      ...rest
    } = props;

    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const {
      connectors: { connect, drag },
    } = useNode();

    const splitIntoCharacters = (text: string): string[] => {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter("en", {
          granularity: "grapheme",
        });
        return Array.from(
          segmenter.segment(text),
          (segment) => segment.segment,
        );
      }
      return Array.from(text);
    };

    const elements = useMemo(() => {
      const currentText = texts[currentTextIndex];
      if (!currentText) return [];

      if (splitBy === "characters") {
        const words = currentText.split(" ");
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }));
      }
      if (splitBy === "words") {
        return currentText.split(" ").map((word, i, arr) => ({
          characters: [word],
          needsSpace: i !== arr.length - 1,
        }));
      }
      if (splitBy === "lines") {
        return currentText.split("\n").map((line, i, arr) => ({
          characters: [line],
          needsSpace: i !== arr.length - 1,
        }));
      }

      return currentText.split(splitBy).map((part, i, arr) => ({
        characters: [part],
        needsSpace: i !== arr.length - 1,
      }));
    }, [texts, currentTextIndex, splitBy]);

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number): number => {
        if (staggerFrom === "first") return index * staggerDuration;
        if (staggerFrom === "last")
          return (totalChars - 1 - index) * staggerDuration;
        if (staggerFrom === "center") {
          const center = Math.floor(totalChars / 2);
          return Math.abs(center - index) * staggerDuration;
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * totalChars);
          return Math.abs(randomIndex - index) * staggerDuration;
        }
        if (typeof staggerFrom === "number") {
          return Math.abs(staggerFrom - index) * staggerDuration;
        }
        return 0;
      },
      [staggerFrom, staggerDuration],
    );

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        if (onNext) onNext(newIndex);
      },
      [onNext],
    );

    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;
      if (nextIndex !== currentTextIndex) {
        handleIndexChange(nextIndex);
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const previous = useCallback(() => {
      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;
      if (prevIndex !== currentTextIndex) {
        handleIndexChange(prevIndex);
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex !== currentTextIndex) {
          handleIndexChange(validIndex);
        }
      },
      [texts.length, currentTextIndex, handleIndexChange],
    );

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) {
        handleIndexChange(0);
      }
    }, [currentTextIndex, handleIndexChange]);

    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        jumpTo,
        reset,
      }),
      [next, previous, jumpTo, reset],
    );

    useEffect(() => {
      if (!auto) return;
      const intervalId = setInterval(next, rotationInterval);
      return () => clearInterval(intervalId);
    }, [next, rotationInterval, auto]);

    return (
      <Container
        ref={(ref: HTMLDivElement) => connect(drag(ref))}
        className={cn("relative flex", mainClassName)}
        {...containerProps}
        {...rest}
      >
        <span className="sr-only">{texts[currentTextIndex]}</span>
        <AnimatePresence
          mode={animatePresenceMode}
          initial={animatePresenceInitial}
        >
          <Element
            is={Text}
            id="rotating-text-content" // Unique ID for the editable element
            canvas
            key={currentTextIndex}
            className={cn(
              splitBy === "lines"
                ? "flex w-full flex-col"
                : "relative flex flex-wrap whitespace-pre-wrap",
            )}
            aria-hidden="true"
            {...textProps} // Apply editable text props
          >
            {elements.map((wordObj, wordIndex) => {
              const previousCharsCount = elements
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);
              const totalChars = elements.reduce(
                (sum, word) => sum + word.characters.length,
                0,
              );
              return (
                <span
                  key={wordIndex}
                  className={cn("inline-flex", splitLevelClassName)}
                >
                  {wordObj.characters.map((char, charIndex) => (
                    <Animated
                      key={charIndex}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(
                          previousCharsCount + charIndex,
                          totalChars,
                        ),
                      }}
                      className={cn("inline-block", elementLevelClassName)}
                    >
                      {char}
                    </Animated>
                  ))}
                  {wordObj.needsSpace && (
                    <span className="whitespace-pre"> </span>
                  )}
                </span>
              );
            })}
          </Element>
        </AnimatePresence>
      </Container>
    );
  });

// Craft.js editor configuration
RotatingText.craft = {
  displayName: "Rotating Text",
  props: {
    texts: ["React", "Bits", "Is", "Cool!"],
    rotationInterval: 2000,
    staggerDuration: 0.025,
    staggerFrom: "last",
    loop: true,
    auto: true,
    splitBy: "characters",
    mainClassName: "justify-center rounded-lg",
    splitLevelClassName: "overflow-hidden pb-1",
    elementLevelClassName: "",
    containerProps: {},
    textProps: {
      text: "This text is not visible, but its styles are applied.",
      className: "px-3 bg-cyan-300 text-black py-2 text-2xl font-bold",
    },
  },
  rules: {
    canDrag: () => true,
  },
};

RotatingText.displayName = "RotatingText";
