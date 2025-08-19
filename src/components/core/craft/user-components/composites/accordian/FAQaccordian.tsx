"use client";

import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container, type ContainerProps } from "../../primitives/Container";
import { Text, type TextProps } from "../../primitives/Typography/Text";

export type FAQItemProps = {
  question: string;
  answer: string;
  containerProps?: Partial<ContainerProps>;
  questionProps?: Partial<TextProps>;
  answerProps?: Partial<TextProps>;
};

export const FAQItem: React.FC<FAQItemProps> & { craft?: any } = ({
  question,
  answer,
  containerProps,
  questionProps,
  answerProps,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const [open, setOpen] = useState(false);

  return (
    <Element
      is={Container}
      canvas
      id="FAQItem-wrapper"
      ref={(ref) => connect(drag(ref as HTMLDivElement))}
      padding="0"
      backgroundColor="transparent"
      {...containerProps}
    >
      <Element
        is={Container}
        canvas
        id="FAQItem-container"
        padding="12px"
        borderRadius="8px"
        border="1px solid #e5e7eb"
        margin="8px 0"
      >
        <Text
          text={question}
          as="h4"
          fontWeight="bold"
          fontSize="16px"
          cursor="pointer"
          onClick={() => setOpen(!open)}
          {...questionProps}
        />
        {open && (
          <Text
            text={answer}
            as="p"
            fontSize="14px"
            margin="8px 0 0 0"
            {...answerProps}
          />
        )}
      </Element>
    </Element>
  );
};

FAQItem.craft = {
  displayName: "FAQ Item",
  props: {
    question: "What is your service about?",
    answer: "We provide high-quality web solutions.",
    containerProps: {},
    questionProps: {},
    answerProps: {},
  },
  rules: { canDrag: () => true },
};
