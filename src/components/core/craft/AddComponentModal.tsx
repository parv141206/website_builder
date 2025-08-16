"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useEditor, Element } from "@craftjs/core";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, LayoutTemplate, Type, Contact } from "lucide-react";
import libraryData from "../craft/user-components/component-library.json";

// Component imports
import { Container } from "./user-components/primitives/Container";
import { Text } from "./user-components/primitives/Text";
import { Card1 } from "./user-components/composites/cards/Card1";
import { SafePreview } from "./withPreview";

// ==================================================================================
// COMPONENT MAP & ICON MAP
// ==================================================================================

const COMPONENT_MAP: Record<string, React.ElementType> = {
  Container,
  Text,
  Card1,
};

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutTemplate,
  Type,
  Contact,
};

// ==================================================================================
// MAIN MODAL COMPONENT
// ==================================================================================

type AddComponentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddComponentModal: React.FC<AddComponentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { actions, query } = useEditor();
  const [activeCategory, setActiveCategory] = useState(
    libraryData.categories[0].name,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddComponent = useCallback(
    (componentConfig: any) => {
      const Component = COMPONENT_MAP[componentConfig.is];
      if (!Component) return;

      // Create a React element from the config
      const element = <Element is={Component} {...componentConfig.props} />;

      // Create the Craft.js node and add it to the ROOT
      const node = query.createNode(element);
      actions.add(node, "ROOT");
      onClose();
    },
    [actions, query, onClose],
  );

  // Memoized filtering logic for performance
  const filteredComponents = useMemo(() => {
    const category = libraryData.categories.find(
      (c) => c.name === activeCategory,
    );
    if (!category) return [];

    if (!searchTerm) {
      return category.components;
    }

    return category.components.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [activeCategory, searchTerm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex h-[70vh] w-full max-w-4xl overflow-hidden rounded-xl border border-white/20 bg-white/80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar for Categories */}
            <aside className="w-56 flex-shrink-0 border-r border-gray-200/80 bg-white/60 p-4">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Components
              </h2>
              <nav className="flex flex-col gap-1">
                {libraryData.categories.map((category) => {
                  const Icon = ICON_MAP[category.icon];
                  const isActive = activeCategory === category.name;
                  return (
                    <button
                      key={category.name}
                      onClick={() => setActiveCategory(category.name)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-200/70"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {category.name}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content: Search and Previews */}
            <main className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-shrink-0 border-b border-gray-200/80 p-4">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid for Component Previews */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-4">
                  {filteredComponents.map((comp) => (
                    <div
                      key={comp.name}
                      className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md"
                      onClick={() => handleAddComponent(comp.preview)}
                    >
                      <h4 className="mb-3 text-sm font-semibold text-gray-700">
                        {comp.name}
                      </h4>

                      {/* This is where the magic happens - just one line! */}
                      <div className="min-h-[100px] overflow-hidden rounded border border-gray-100 bg-white">
                        <SafePreview
                          componentConfig={comp.preview}
                          scale={0.8}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {filteredComponents.length === 0 && (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">No components found.</p>
                  </div>
                )}
              </div>
            </main>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200/80 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
