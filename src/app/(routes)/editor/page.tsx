"use client";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import React, { useState, useEffect } from "react";
// Import hooks and providers
import { useEditorPersistence } from "~/hooks/useEditorPersistence";
import { ThemeProvider, useTheme } from "~/themes";
// Import UI components
import { SettingsPanel } from "~/components/core/craft/SettingsPanel";
import { AddComponentModal } from "~/components/core/craft/AddComponentModal";
import { DefaultLayer, Layers } from "~/components/core/craft/layers-panel";
import { TopBar } from "~/components/core/craft/TopBar";
import { LuFolderTree } from "react-icons/lu";
import { useEditorHotkeys } from "~/hooks/useEditorHotkeys";
import { DeviceFrame } from "~/components/core/craft/utils/DeviceFrame";
import { COMPONENT_RESOLVER } from "~/components/core/craft/user-components/componentResolver";
import { useAppStateStore } from "~/store/AppStateStore";
import { ThemePanel } from "~/components/core/craft/ThemePanel";
import ImageManager from "~/components/core/craft/image-manager/ImageManager";

const ThemeUpdater = () => {
  const { actions } = useEditor();
  const theme = useTheme();

  useEffect(() => {
    actions.setProp("ROOT", (props) => {
      props.background = theme.colors.background.secondary;
    });
  }, [theme, actions]);

  return null;
};

// ==================================================================================
// IMPORTANT: Add ThemeUpdater to the resolver so Craft.js recognizes it
// ==================================================================================
const EXTENDED_COMPONENT_RESOLVER = {
  ...COMPONENT_RESOLVER,
  ThemeUpdater,
};

const { Container, Text } = COMPONENT_RESOLVER;

// ==================================================================================
// This component contains the actual editor UI.
// ==================================================================================
const EditorUI = ({ savedJson }: { savedJson: string | null }) => {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEditorHotkeys();

  console.log(
    "EditorUI rendering with savedJson:",
    savedJson ? "JSON present" : "No JSON",
  );
  const { activePanel, setActivePanel } = useAppStateStore();
  const { selected } = useEditor((state) => ({
    selected: state.events.selected.size > 0,
  }));
  // Logic to switch back to settings panel when a component is selected
  useEffect(() => {
    if (selected) {
      setActivePanel("settings");
    }
  }, [selected, setActivePanel]);
  return (
    <div className="flex h-screen w-full flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-68 flex-shrink-0 flex-col gap-1 overflow-y-auto bg-white p-3 py-4 shadow-lg">
          <div className="flex items-center justify-start gap-1 font-bold">
            <LuFolderTree /> <div>Outline</div>
          </div>
          <Layers renderLayer={DefaultLayer} />
        </div>

        <main className="relative flex-1 overflow-y-auto p-4 transition-colors duration-200">
          <DeviceFrame savedJson={savedJson}>
            {/* These children will only be used when savedJson is null (first load) */}
            <Element
              is={Container}
              canvas
              id="ROOT"
              background={theme.colors.background.secondary}
              minHeight="100%"
              padding="24px"
            >
              <Element is={ThemeUpdater} />

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
                background={theme.colors.background.tertiary}
                borderRadius="8px"
              >
                <Text text="This is an inner container." />
              </Element>
            </Element>
          </DeviceFrame>

          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 transform">
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer rounded-full bg-black px-4 py-2 text-white shadow-lg transition-all hover:scale-110 active:scale-90"
            >
              + Add Component
            </button>
          </div>
        </main>
        <ImageManager />
        <div className="w-80 flex-shrink-0 overflow-y-auto bg-white shadow-lg">
          {activePanel === "theme" ? <ThemePanel /> : <SettingsPanel />}
        </div>
        <AddComponentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

// ==================================================================================
// This wrapper component handles the loading state.
// ==================================================================================
const App = () => {
  const { isLoaded, savedJson } = useEditorPersistence();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading Editor...</p>
      </div>
    );
  }

  return <EditorUI savedJson={savedJson} />;
};

// ==================================================================================
// The final, clean page export - using the extended resolver
// ==================================================================================
export default function EditorPage() {
  return (
    <ThemeProvider>
      <Editor resolver={EXTENDED_COMPONENT_RESOLVER}>
        <App />
      </Editor>
    </ThemeProvider>
  );
}
