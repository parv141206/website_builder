import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { ThemePanel } from "./ThemePanel";
import ImageManager from "./image-manager/ImageManager";
import { SettingsPanel } from "./SettingsPanel";
// ...other imports (ThemePanel, ImageManager, SettingsPanel, etc.)

const SIDEBAR_WIDTH = "20rem"; // matches tailwind w-80

export function Sidebar({ activePanel }: { activePanel: string }) {
  // keep lastPanel so we don't unmount the content immediately on "hide"
  const [lastPanel, setLastPanel] = useState<string | null>(
    activePanel !== "hide" ? activePanel : null,
  );

  useEffect(() => {
    if (activePanel !== "hide") {
      setLastPanel(activePanel);
    }
    // when activePanel === 'hide' we intentionally keep lastPanel until animation ends
  }, [activePanel]);

  const isHidden = activePanel === "hide";

  return (
    <motion.aside
      // don't animate on first mount (initial false)
      initial={false}
      // animate width so layout reflows and main expands/contracts
      animate={
        isHidden
          ? { width: 0, opacity: 0 } // collapsed
          : { width: SIDEBAR_WIDTH, opacity: 1 } // expanded
      }
      transition={{ duration: 0.28, ease: "easeInOut" }}
      // called after the animation finishes
      onAnimationComplete={() => {
        // if we finished hiding, we can drop the lastPanel (unmount inner content)
        if (isHidden) setLastPanel(null);
      }}
      className="flex-shrink-0 overflow-hidden bg-white shadow-lg"
      style={{
        // pointerEvents must switch instantly (not animated)
        pointerEvents: isHidden ? "none" : "auto",
        willChange: "width, opacity",
      }}
    >
      {/* inner wrapper — do NOT conditionally render based on activePanel directly */}
      <div className="h-full">
        {/* render the last opened panel so it stays visible while animating out */}
        {lastPanel === "theme" && <ThemePanel />}
        {lastPanel === "images" && <ImageManager />}
        {lastPanel === "settings" && <SettingsPanel />}
      </div>
    </motion.aside>
  );
}
