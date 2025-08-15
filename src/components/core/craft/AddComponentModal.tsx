"use client";
import React from "react";
import { useEditor, Element } from "@craftjs/core";
import { Container } from "./user-components/primitives/Container";
import { Text } from "./user-components/primitives/Text";
import { Card1 } from "./user-components/composites/cards/Card1";

type AddComponentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddComponentModal: React.FC<AddComponentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { actions, query } = useEditor();

  const availableComponents = [
    {
      name: "Container",
      component: <Element is={Container} canvas padding="16px" />,
    },
    {
      name: "Text",
      component: <Text text="New Text Element" />,
    },
    {
      name: "Card1",
      component: <Card1 title="Something" description="Also something" />,
    },
    // Add more components here in the future
  ];

  // This is the corrected function
  const handleAddComponent = (component: React.ReactElement) => {
    // 1. First, create a valid Craft.js node from the React element.
    const newNode = query.createNode(component);

    // 2. Then, add the newly created node to the ROOT canvas.
    actions.add(newNode, "ROOT");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Add a Component
          </h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {availableComponents.map(({ name, component }) => (
            <button
              key={name}
              onClick={() => handleAddComponent(component)}
              className="rounded-lg border p-4 transition-colors hover:border-blue-500 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
