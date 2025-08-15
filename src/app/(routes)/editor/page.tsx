"use client";
import { Editor, Frame, Element } from "@craftjs/core";
import React, { useState } from "react";

import { Container } from "~/components/core/craft/user-components/primitives/Container";
import { Text } from "~/components/core/craft/user-components/primitives/Text";
import { SettingsPanel } from "~/components/core/craft/SettingsPanel";
import { AddComponentModal } from "~/components/core/craft/AddComponentModal";
import { Card1 } from "~/components/core/craft/user-components/composites/cards/Card1";
import { DefaultLayer, Layers, useLayer } from "@craftjs/layers";

export default function EditorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Editor resolver={{ Container, Text, Card1 }}>
      <div className="flex h-screen w-full">
        <Layers renderLayer={DefaultLayer} />
        <main className="flex flex-1 flex-col items-center overflow-y-auto bg-gray-100 p-4">
          <div className="w-full max-w-4xl flex-grow bg-white shadow-lg">
            <Frame>
              <Element
                is={Container}
                canvas
                id="ROOT"
                padding="24px"
                background="#ffffff"
                height="100%"
              >
                <Text
                  text="Welcome to your new page!"
                  as="h1"
                  fontSize="24px"
                  fontWeight="bold"
                  textAlign="center"
                  margin="0 0 24px 0"
                />
                <Element
                  is={Container}
                  canvas
                  padding="16px"
                  background="#f3f4f6"
                  borderRadius="8px"
                >
                  <Text text="This is an inner container. Drag components here or double-click to edit text." />
                </Element>
              </Element>
            </Frame>
          </div>
          <div className="fixed bottom-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              + Add Component
            </button>
          </div>
        </main>

        <SettingsPanel />
        <AddComponentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </Editor>
  );
}
