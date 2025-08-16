"use client";
import React from "react";
import { useEditor } from "@craftjs/core";

// --- 1. Import the desired icons ---
import { FiEye, FiEyeOff, FiLink, FiChevronDown } from "react-icons/fi";

import { EditableLayerName } from "./EditableLayerName";
import { useLayer } from "../useLayer";

export const DefaultLayerHeader = () => {
  const {
    id,
    depth,
    expanded,
    children,
    connectors: { drag, layerHeader },
    actions: { toggleLayer },
  } = useLayer((layer) => ({
    expanded: layer.expanded,
  }));

  const { hidden, actions, selected, topLevel } = useEditor((state, query) => {
    const selected = query.getEvent("selected").first() === id;
    return {
      hidden: state.nodes[id]?.data.hidden,
      selected,
      topLevel: query.node(id).isTopLevelCanvas(),
    };
  });

  return (
    <div
      ref={(ref) => drag(ref)}
      style={{
        paddingLeft: `${depth * 20}px`,
      }}
      className={`me-3 flex cursor-pointer items-center rounded-md px-3 py-1 text-sm transition-colors ${selected ? "bg-emerald-200 text-black" : "hover:bg-gray-200"} `}
    >
      {/* Hide/Show Button with React Icons */}
      <button
        className={`mr-2 flex items-center justify-center transition-opacity ${selected ? "text-gray-500" : "text-gray-500"} `}
        onClick={() => actions.setHidden(id, !hidden)}
      >
        {/* --- 2. Conditionally render FiEye or FiEyeOff --- */}
        {hidden ? <FiEyeOff /> : <FiEye />}
      </button>

      <div ref={(ref) => layerHeader(ref)} className="flex flex-1 items-center">
        {/* Top-Level Indicator with React Icons */}
        {topLevel && (
          <span className={`mr-2 ${selected ? "text-white" : "text-blue-500"}`}>
            {/* --- 3. Use the FiLink icon --- */}
            <FiLink />
          </span>
        )}

        <div className="flex-1">
          <EditableLayerName />
        </div>

        {/* Expand/Collapse Chevron with React Icons */}
        {children && children.length > 0 && (
          <button
            className="flex items-center justify-center"
            onClick={() => toggleLayer()}
          >
            <FiChevronDown
              className={`text-lg transition-transform duration-200 ${expanded ? "rotate-180" : "rotate-0"} ${selected ? "text-white" : "text-gray-500"} `}
            />
          </button>
        )}
      </div>
    </div>
  );
};
