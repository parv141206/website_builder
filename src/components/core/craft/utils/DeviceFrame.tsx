// src/components/core/craft/utils/DeviceFrame.tsx
"use client";
import React, { useRef, useEffect } from "react"; // Import useRef and useEffect
import { Frame } from "@craftjs/core";
import { useDeviceStore } from "~/store/DeviceStore";

const deviceWidths: Record<string, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

type DeviceFrameProps = {
  children?: React.ReactNode;
  savedJson: string | null;
};

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  savedJson,
}) => {
  const { device } = useDeviceStore();
  const width = deviceWidths[device] || "100%";
  // Create a ref for the div that directly wraps the Craft.js Frame component
  const frameWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect runs after the component (and its children, including the Craft.js Frame)
    // has mounted. We need to find the actual iframe element that Craft.js renders.

    const injectTailwindJit = () => {
      if (!frameWrapperRef.current) return;

      // Find the iframe element within the ref's current DOM node.
      // Craft.js's Frame component typically renders a single iframe.
      const iframe = frameWrapperRef.current.querySelector("iframe");

      if (iframe && iframe.contentDocument) {
        const iframeDoc = iframe.contentDocument;
        const iframeHead = iframeDoc.head;

        // Check if the Tailwind JIT script is already injected to prevent duplicates
        if (
          !iframeHead.querySelector('script[src="https://cdn.tailwindcss.com"]')
        ) {
          const script = iframeDoc.createElement("script");
          script.src = "https://cdn.tailwindcss.com";
          script.async = true; // Load asynchronously to not block rendering
          script.onload = () => {
            console.log(
              "Tailwind JIT script loaded into Craft.js iframe for live preview.",
            );
            // If you have a custom tailwind.config object for the editor, you would inject it here
            // For Tailwind 4, if you don't have a specific config, this part isn't strictly necessary.
            /*
            const configScript = iframeDoc.createElement('script');
            configScript.innerHTML = `
              tailwind.config = {
                theme: {
                  extend: {
                    // example: colors: { 'my-custom-red': '#ff0000' }
                  }
                },
                // prefix: 'tw-', // If you use a custom prefix in your Tailwind setup
              };
            `;
            iframeHead.appendChild(configScript);
            */
          };
          script.onerror = (e) => {
            console.error("Failed to load Tailwind JIT script into iframe:", e);
          };
          iframeHead.appendChild(script);

          // Return a cleanup function to remove the script if the component unmounts
          return () => {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
              console.log("Tailwind JIT script removed from iframe.");
            }
            // If config script was added, remove it too
            /*
            if (configScript && configScript.parentNode) {
              configScript.parentNode.removeChild(configScript);
            }
            */
          };
        }
      }
      return undefined; // No cleanup needed if script wasn't added
    };

    // Use a MutationObserver to reliably detect when the iframe's contentDocument is ready.
    // This is more robust as Craft.js might render its iframe and content asynchronously.
    let cleanupFn: (() => void) | undefined;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const iframe = frameWrapperRef.current?.querySelector("iframe");
          if (iframe && iframe.contentDocument) {
            // Iframe and its document are ready, inject and disconnect observer
            cleanupFn = injectTailwindJit();
            observer.disconnect();
            break;
          }
        }
      }
    });

    if (frameWrapperRef.current) {
      // Observe the wrapper div for changes, including children being added (the iframe)
      observer.observe(frameWrapperRef.current, {
        childList: true,
        subtree: true,
      });
    }

    // Also attempt injection immediately in case the iframe is already present on initial render
    cleanupFn = injectTailwindJit();

    return () => {
      observer.disconnect(); // Clean up observer on component unmount
      if (cleanupFn) {
        cleanupFn(); // Run script cleanup if it was injected
      }
    };
  }, []); // Empty dependency array means this effect runs only once after the initial render

  return (
    <div
      ref={frameWrapperRef} // Attach the ref to the div that contains the Frame component
      className="mx-auto h-full w-full overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out"
      style={{ maxWidth: width }}
    >
      <div className="h-full w-full overflow-y-auto">
        {/* Craft.js Frame component remains here */}
        {savedJson ? <Frame json={savedJson} /> : <Frame>{children}</Frame>}
      </div>
    </div>
  );
};
