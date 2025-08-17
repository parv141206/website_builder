"use client";

import React, { useMemo } from "react";
import { Editor, Frame, Element } from "@craftjs/core";

import { COMPONENT_RESOLVER } from "../user-components/componentResolver";

type MiniCraftPreviewProps = {
  componentConfig: {
    is: string;
    props?: any;
  };
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
};

export const MiniCraftPreview: React.FC<MiniCraftPreviewProps> = ({
  componentConfig,
  scale = 0.8,
  className = "",
  style = {},
}) => {
  const Component =
    COMPONENT_RESOLVER[componentConfig.is as keyof typeof COMPONENT_RESOLVER];

  // Error fallback
  if (!Component) {
    return (
      <div
        className={`flex items-center justify-center rounded border border-red-200 bg-red-50 p-3 text-xs text-red-600 ${className}`}
        style={style}
      >
        Unknown: {componentConfig.is}
      </div>
    );
  }

  // Memoize the preview to avoid unnecessary re-renders
  const preview = useMemo(
    () => (
      <div
        className={`preview-container ${className}`}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          overflow: "hidden",
          pointerEvents: "none",
          userSelect: "none",
          ...style,
        }}
      >
        <Editor
          resolver={COMPONENT_RESOLVER}
          enabled={false}
          onRender={({ render }) => (
            <div style={{ pointerEvents: "none", userSelect: "none" }}>
              {render}
            </div>
          )}
        >
          <Frame>
            <Element
              is={Component}
              {...componentConfig.props}
              // Override any editor-specific props
              canvas={undefined}
              connectors={undefined}
            />
          </Frame>
        </Editor>
      </div>
    ),
    [Component, componentConfig, scale, className, style],
  );

  return preview;
};

// ==================================================================================
// BATCH PREVIEW COMPONENT (For multiple previews)
// ==================================================================================

type BatchPreviewProps = {
  components: Array<{
    name: string;
    config: { is: string; props?: any };
  }>;
  onSelect?: (config: { is: string; props?: any }) => void;
};

export const BatchPreview: React.FC<BatchPreviewProps> = ({
  components,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {components.map((comp) => (
        <div
          key={comp.name}
          className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md"
          onClick={() => onSelect?.(comp.config)}
        >
          <h4 className="mb-3 text-sm font-semibold text-gray-700">
            {comp.name}
          </h4>

          <div className="relative min-h-[80px] overflow-hidden rounded border border-gray-100 bg-white">
            <MiniCraftPreview
              componentConfig={comp.config}
              scale={0.75}
              className="h-full w-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================================================================================
// ERROR BOUNDARY FOR PREVIEW SAFETY
// ==================================================================================

type PreviewErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
};

class PreviewErrorBoundary extends React.Component<
  PreviewErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("Preview component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center rounded border border-yellow-200 bg-yellow-50 p-4 text-xs text-yellow-700">
            Preview Error: {this.props.componentName || "Unknown"}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// ==================================================================================
// SAFE PREVIEW WRAPPER
// ==================================================================================

export const SafePreview: React.FC<MiniCraftPreviewProps> = (props) => {
  return (
    <PreviewErrorBoundary
      componentName={props.componentConfig.is}
      fallback={
        <div className="flex items-center justify-center rounded border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
          {props.componentConfig.is} Preview
        </div>
      }
    >
      <MiniCraftPreview {...props} />
    </PreviewErrorBoundary>
  );
};
