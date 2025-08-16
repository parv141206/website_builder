"use client";
import { Editor, Frame, Element } from "@craftjs/core";
import React, { useState } from "react";

import { Container } from "~/components/core/craft/user-components/primitives/Container";
import { Text } from "~/components/core/craft/user-components/primitives/Text";
import { SettingsPanel } from "~/components/core/craft/SettingsPanel";
import { AddComponentModal } from "~/components/core/craft/AddComponentModal";
import { Card1 } from "~/components/core/craft/user-components/composites/cards/Card1";
import { DefaultLayer, Layers } from "~/components/core/craft/layers-panel";
import { ThemeProvider } from "~/themes";
import { TopBar } from "~/components/core/craft/TopBar";
import { LuFolderTree } from "react-icons/lu";

export default function EditorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <Editor resolver={{ Container, Text, Card1 }}>
        <div className="flex h-screen w-full flex-col bg-neutral-100">
          <TopBar />
          <div className="flex flex-1 overflow-hidden">
            <div className="flex w-64 flex-shrink-0 flex-col gap-1 overflow-y-auto bg-white p-3 py-4 shadow-lg">
              <div className="flex items-center justify-start gap-1 font-bold">
                <LuFolderTree />
                <div>Outline</div>
              </div>
              {/* <br className="" /> */}
              <Layers renderLayer={DefaultLayer} />
            </div>

            <main className="relative flex-1 overflow-y-auto p-4">
              <div className="mx-auto h-full w-full max-w-4xl">
                <div className="h-full w-full bg-white shadow-lg">
                  <Frame>
                    <Element
                      is={Container}
                      canvas
                      id="ROOT"
                      padding="24px"
                      background="#ffffff"
                      minHeight="100%"
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
              </div>

              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 transform">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  + Add Component
                </button>
              </div>
            </main>

            <div className="w-100 flex-shrink-0 overflow-y-auto bg-white shadow-lg">
              <SettingsPanel />
            </div>

            <AddComponentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      </Editor>
    </ThemeProvider>
  );
}
