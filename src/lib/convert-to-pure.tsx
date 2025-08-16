// lib/convert-to-pure.ts
import React from "react";

// Type for component props
type ComponentProps = Record<string, any>;

// Type for the converter function
type ComponentConverter = (props: ComponentProps) => React.ReactElement;

/**
 * Converts a CraftJS component to a pure React component by removing all editor-specific functionality
 * @param componentName - The name of the component to convert
 * @param originalComponent - The original CraftJS component
 * @returns A pure React component suitable for preview rendering
 */
export function convertComponentToPure(
  componentName: string,
  originalComponent: React.ComponentType<any>,
): React.ComponentType<any> {
  // Create a pure wrapper component
  const PureComponent: React.FC<any> = (props) => {
    // Filter out CraftJS-specific props
    const cleanProps = { ...props };

    // Remove CraftJS-specific properties
    delete cleanProps.canvas;
    delete cleanProps.connectors;
    delete cleanProps.selected;
    delete cleanProps.editing;
    delete cleanProps.id;
    delete cleanProps.data;

    // Remove event handlers that are editor-specific
    delete cleanProps.onDoubleClick;
    delete cleanProps.onBlur;
    delete cleanProps.onKeyDown;
    delete cleanProps.contentEditable;
    delete cleanProps.suppressContentEditableWarning;
    delete cleanProps.dangerouslySetInnerHTML;

    // Create a mock theme object (you can customize this based on your theme structure)
    const mockTheme = {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        background: "#ffffff",
        text: "#1f2937",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
    };

    try {
      // Try to render the component with cleaned props
      // We need to handle the component rendering carefully to avoid CraftJS dependencies

      // For Container components
      if (componentName === "Container") {
        const style = {
          display: cleanProps.display || "flex",
          flexDirection: cleanProps.flexDirection || "column",
          justifyContent: cleanProps.justifyContent,
          alignItems: cleanProps.alignItems,
          gap: cleanProps.gap,
          width: cleanProps.width,
          height: cleanProps.height,
          padding: cleanProps.padding,
          margin: cleanProps.margin,
          backgroundColor: cleanProps.backgroundColor || cleanProps.background,
          borderRadius: cleanProps.borderRadius,
          border: cleanProps.border,
          boxShadow: cleanProps.boxShadow,
          ...cleanProps.style,
        };

        return (
          <div style={style} className={cleanProps.className}>
            {cleanProps.children || "Container"}
          </div>
        );
      }

      // For Text components
      if (componentName === "Text") {
        const style = {
          fontSize: cleanProps.fontSize,
          fontWeight: cleanProps.fontWeight,
          color: cleanProps.color,
          textAlign: cleanProps.textAlign,
          lineHeight: cleanProps.lineHeight,
          ...cleanProps.style,
        };

        const Tag = cleanProps.tagName || "p";

        return React.createElement(
          Tag,
          { style, className: cleanProps.className },
          cleanProps.text || cleanProps.children || "Sample Text",
        );
      }

      // For Card components or other composites
      if (componentName.startsWith("Card")) {
        return (
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              ...cleanProps.style,
            }}
            className={cleanProps.className}
          >
            <div style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
              {cleanProps.title || "Card Title"}
            </div>
            <div style={{ color: "#6b7280" }}>
              {cleanProps.description ||
                cleanProps.children ||
                "Card description goes here..."}
            </div>
          </div>
        );
      }

      // Fallback: try to render the original component with cleaned props
      return React.createElement(originalComponent, cleanProps);
    } catch (error) {
      console.warn(`Failed to render pure component ${componentName}:`, error);

      // Fallback preview
      return (
        <div
          style={{
            padding: "1rem",
            border: "2px dashed #d1d5db",
            borderRadius: "0.375rem",
            textAlign: "center",
            color: "#6b7280",
            backgroundColor: "#f9fafb",
          }}
        >
          {componentName} Preview
        </div>
      );
    }
  };

  // Set display name for debugging
  PureComponent.displayName = `Pure${componentName}`;

  return PureComponent;
}

/**
 * Alternative approach: Get pure component code as string
 * @param componentName - The name of the component
 * @param props - The props to render with
 * @returns JSX string representation
 */
export function getComponentPureCode(
  componentName: string,
  props: ComponentProps = {},
): string {
  // Clean props
  const cleanProps = { ...props };
  delete cleanProps.canvas;
  delete cleanProps.connectors;
  delete cleanProps.selected;
  delete cleanProps.editing;

  // Generate JSX string based on component type
  switch (componentName) {
    case "Container":
      const containerStyle = {
        display: cleanProps.display || "flex",
        flexDirection: cleanProps.flexDirection || "column",
        ...(cleanProps.style || {}),
      };

      return `<div style={${JSON.stringify(containerStyle)}}>
  ${cleanProps.children || "Container Content"}
</div>`;

    case "Text":
      const textStyle = {
        fontSize: cleanProps.fontSize,
        color: cleanProps.color,
        ...(cleanProps.style || {}),
      };

      return `<${cleanProps.tagName || "p"} style={${JSON.stringify(textStyle)}}>
  ${cleanProps.text || "Sample Text"}
</${cleanProps.tagName || "p"}>`;

    default:
      return `<div className="component-preview">
  ${componentName} Preview
</div>`;
  }
}

/**
 * Create a safe preview component that won't break if CraftJS dependencies are missing
 * @param componentConfig - The component configuration from library
 * @returns A safe React component for preview
 */
export function createPreviewComponent(
  componentConfig: any,
): React.ComponentType<any> {
  const PreviewComponent: React.FC = () => {
    const { is: componentName, props = {} } = componentConfig;

    // Return a safe, static preview based on the component type
    switch (componentName) {
      case "Container":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: props.flexDirection || "column",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              minHeight: "60px",
              backgroundColor: props.backgroundColor || "#f9fafb",
              alignItems: props.alignItems || "flex-start",
              justifyContent: props.justifyContent || "flex-start",
            }}
          >
            <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              Container
            </div>
          </div>
        );

      case "Text":
        return (
          <div
            style={{
              fontSize: props.fontSize || "1rem",
              color: props.color || "#374151",
              fontWeight: props.fontWeight || "normal",
              padding: "0.5rem",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "0.25rem",
            }}
          >
            {props.text || "Sample Text"}
          </div>
        );

      default:
        return (
          <div
            style={{
              padding: "1rem",
              border: "2px dashed #d1d5db",
              borderRadius: "0.375rem",
              textAlign: "center",
              color: "#6b7280",
              backgroundColor: "#f9fafb",
              fontSize: "0.875rem",
            }}
          >
            {componentName} Preview
          </div>
        );
    }
  };

  PreviewComponent.displayName = `Preview${componentConfig.is}`;
  return PreviewComponent;
}
