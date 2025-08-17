"use client";
import React from "react";
import { useEditor } from "@craftjs/core";
import { DefaultLayerHeader } from "./DefaultLayerHeader";
import { useLayer } from "../useLayer";

export type DefaultLayerProps = {
  children?: React.ReactNode;
};

export const DefaultLayer = ({ children }: DefaultLayerProps) => {
  const {
    id,
    expanded,
    hovered,
    connectors: { layer },
  } = useLayer((layer) => ({
    hovered: layer.event.hovered,
    expanded: layer.expanded,
  }));

  const { hasChildCanvases } = useEditor((state, query) => ({
    hasChildCanvases: query.node(id).isParentOfTopLevelNodes(),
  }));

  return (
    <div
      ref={(ref) => layer(ref)}
      className={`flex w-64 flex-col rounded-md transition-colors duration-150 ${hovered && !hasChildCanvases ? "" : ""} ${hasChildCanvases && expanded ? "mt-2" : ""} `}
    >
      <DefaultLayerHeader />
      {expanded && children && (
        <div className={`relative ${hasChildCanvases ? "" : ""}`}>
          {/* {hasChildCanvases && (
            <div className="top-0 -left-px h-full w-0.5 bg-gray-200" />
          )} */}
          <div className="flex flex-col">{children}</div>
        </div>
      )}
    </div>
  );
};
